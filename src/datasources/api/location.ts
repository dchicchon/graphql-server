
import { Client } from '@googlemaps/google-maps-services-js'
import { ModelCtor, Model } from 'sequelize/types'
// import { Arguments, CreateLocationArguments, UpdateObject } from '../../interfaces/Types'
import { CreateLocationArguments, FindLocationArguments, UpdateLocationArguments, DeleteLocationArguments } from '../../interfaces/LocationTypes'
export default class Location {
    location
    constructor(location: ModelCtor<Model>) {
        this.location = location
    }
    async createLocation({ name, address, organizationId }: CreateLocationArguments) {
        const client = new Client()
        const key: string = process.env.GOOGLE_MAPS_API_KEY! // fix this later somehow
        let r;
        try {
            r = await client.geocode({
                params: {
                    address: address,
                    key: key
                },
                timeout: 3000
            })
        } catch (e) {
            return { message: 'Error in creating location' }
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
            return location;
        }

    }
    async getLocation({ id }: FindLocationArguments) {
        const location = await this.location.findOne({ where: { id } });
        return location;
    }
    async getLocations({ ids }: FindLocationArguments) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getLocation({ id })));
        }
    }
    async getAllLocations() {
        const locations = await this.location.findAll();
        return locations
    }
    async getAllLocationsByOrgId({ id }: FindLocationArguments) {
        const locations = await this.location.findAll({
            where: {
                organizationId: id,
            },
        });
        return locations;
    }

    async updateLocation(updateLocationObject: UpdateLocationArguments) {
        if (updateLocationObject.address) {
            const client = new Client()
            let r
            const key: string = process.env.GOOGLE_MAPS_API_KEY!
            try {
                r = await client.geocode({
                    params: {
                        address: updateLocationObject.address,
                        key
                    },
                    timeout: 5000
                })

            } catch (e) {
                return { message: 'Error in updating location' }
            } finally {
                console.log("Finally of location geocode")
                if (!r) {
                    return { message: `Location:${updateLocationObject.address} was not found. Please check out the README.md or https://developers.google.com/maps/documentation/geocoding/overview in order to understand how to place a valid address ` }
                }
                let { lat, lng } = r.data.results[0].geometry.location
                updateLocationObject.latitude = lat
                updateLocationObject.longitude = lng
            }
        }
        let { latitude, longitude, name, address } = updateLocationObject
        await this.location.update({
            latitude,
            longitude,
            name,
            address
        }, {
            where: {
                id: updateLocationObject.id
            }
        });

        const findResults = await this.getLocation({ id: updateLocationObject.id })
        return findResults





    }
    async deleteLocation({ id }: DeleteLocationArguments) {
        const location = await this.location.destroy({ where: { id } });
        return location;
    }

    async deleteLocationByOrganizationId({ organizationId }: DeleteLocationArguments) {
        const deleteResult = await this.location.destroy({ where: { organizationId } })
        return deleteResult

    }
}