"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
class Location {
    constructor(location) {
        this.location = location;
    }
    async createLocation({ name, address, organizationId }) {
        const client = new google_maps_services_js_1.Client();
        const key = process.env.GOOGLE_MAPS_API_KEY;
        let r;
        try {
            r = await client.geocode({
                params: {
                    address: address,
                    key: key
                },
                timeout: 3000
            });
        }
        catch (e) {
            return { message: "Error in creating location" };
        }
        finally {
            if (!r) {
                return { message: `Location:${address} was not found. Please check out the README.md or https://developers.google.com/maps/documentation/geocoding/overview in order to understand how to place a valid address ` };
            }
            let { lat, lng } = r.data.results[0].geometry.location;
            const [location, created] = await this.location.findOrCreate({
                where: {
                    name,
                    address,
                    latitude: lat,
                    longitude: lng,
                    organizationId,
                },
            });
            return location.dataValues;
        }
    }
    async getLocation({ id }) {
        const location = await this.location.findOne({ where: { id } });
        return location;
    }
    async getLocations({ ids }) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getLocation({ id })));
        }
    }
    async getAllLocations() {
        const locations = await this.location.findAll();
        return locations;
    }
    async getAllLocationsByOrgId({ id }) {
        const locations = await this.location.findAll({
            where: {
                organizationId: id,
            },
        });
        return locations;
    }
    async updateLocation({ id, name, address }) {
        if (address) {
            const client = new google_maps_services_js_1.Client();
            let r;
            const key = process.env.GOOGLE_MAPS_API_KEY;
            try {
                r = await client.geocode({
                    params: {
                        address,
                        key
                    },
                    timeout: 3000
                });
            }
            catch (e) {
                return { message: "Error in updating location" };
            }
            finally {
                if (!r) {
                    return { message: `Location:${address} was not found. Please check out the README.md or https://developers.google.com/maps/documentation/geocoding/overview in order to understand how to place a valid address ` };
                }
                let { lat, lng } = r.data.results[0].geometry.location;
                const updateObject = {};
                if (name)
                    updateObject.name = name;
                updateObject.address = address;
                updateObject.latitude = lat;
                updateObject.longitude = lng;
                const results = await this.location.update(updateObject, {
                    where: {
                        id
                    }
                });
                const findResults = await this.getLocation({ id });
                return findResults;
            }
        }
        else {
            const results = await this.location.update({
                name,
            }, {
                where: {
                    id
                }
            });
            const findResults = await this.getLocation({ id });
            return findResults;
        }
    }
    async deleteLocation({ id }) {
        const location = await this.location.destroy({ where: { id } });
        return location;
    }
    async deleteLocationByOrganizationId({ organizationId }) {
        const deleteResult = await this.location.destroy({ where: { organizationId } });
        return deleteResult;
    }
}
exports.default = Location;
