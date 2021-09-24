
import { Client } from '@googlemaps/google-maps-services-js'
import { Arguments, CreateLocationArguments, UpdateObject } from '../../interfaces/Types'

export default class Location {
    location
    constructor(location: any) {
        this.location = location
    }
    async createLocation({ name, address, organizationId }: CreateLocationArguments) {
        // console.log("Creating Location API")
        // console.log(name, address, organizationId)
        const client = new Client()
        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
        const key: string = process.env.GOOGLE_MAPS_API_KEY! // fix this later somehow
        let r;
        try {
            // console.log("Getting Geocode")
            r = await client.geocode({
                params: {
                    address: address,
                    key: key
                },
                timeout: 3000 // milliseconds
            })
        } catch (e) {
            // console.log("Error in making location")
            return { message: "Error in creating location" }
            // return { message: e.response.data.error_message }
        } finally {
            if (!r) {
                return { message: `Location:${address} was not found. Please check out the README.md or https://developers.google.com/maps/documentation/geocoding/overview in order to understand how to place a valid address ` }
            }
            let { lat, lng } = r.data.results[0].geometry.location
            const [location, created] = await this.location.findOrCreate({
                where: {
                    name,
                    address,
                    latitude: lat,
                    longitude: lng,
                    organizationId,
                },
            });
            // console.log(location)
            return location.dataValues
            // return created ? location.dataValues : { message: "Location Already Created" }
        }

    }
    async getLocation({ id }: Arguments) {
        const location = await this.location.findOne({ where: { id } });
        // console.log(location);
        return location;
    }
    async getLocations({ ids }: Arguments) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getLocation({ id })));
        }
    }
    async getAllLocations() {
        const locations = await this.location.findAll();
        return locations
    }
    async getAllLocationsByOrgId({ id }: Arguments) {
        const locations = await this.location.findAll({
            where: {
                organizationId: id,
            },
        });
        return locations;
    }

    async updateLocation({ id, name, address }: Arguments) {
        if (address) {
            // console.log("Getting New latitude and longitude")
            const client = new Client()
            let r
            const key: string = process.env.GOOGLE_MAPS_API_KEY!
            try {
                r = await client.geocode({
                    params: {
                        address,
                        key
                    },
                    timeout: 3000 // milliseconds
                })

            } catch (e) {
                return { message: "Error in updating location" }
                // return { message: e.response.data.error_message }
            } finally {
                if (!r) {
                    return { message: `Location:${address} was not found. Please check out the README.md or https://developers.google.com/maps/documentation/geocoding/overview in order to understand how to place a valid address ` }
                }
                let { lat, lng } = r.data.results[0].geometry.location
                const updateObject: UpdateObject = {}
                if (name) updateObject.name = name;
                updateObject.address = address
                updateObject.latitude = lat
                updateObject.longitude = lng
                const results = await this.location.update(updateObject, {
                    where: {
                        id
                    }
                });
                // console.log("results")
                // console.log(results)
                return results[0]
            }
        } else {
            const results = await this.location.update({
                name,
            }, {
                where: {
                    id
                }
            });
            return results[0]
        }



    }
    async deleteLocation({ id }: Arguments) {
        const location = await this.location.destroy({ where: { id } });
        return !!location;
    }
}