"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const apollo_datasource_1 = require("apollo-datasource");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
class API extends apollo_datasource_1.DataSource {
    constructor(store) {
        super();
        this.store = store;
    }
    async createOrganization({ name }) {
        const [organization, created] = await this.store.organization.findOrCreate({
            where: {
                name,
            },
        });
        return created ? organization.dataValues : { message: "Organization Already Created" };
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
            console.log(e);
            return { message: "Error in creating location" };
        }
        finally {
            if (!r) {
                return { message: `Location:${address} was not found. Please check out the README.md or https://developers.google.com/maps/documentation/geocoding/overview in order to understand how to place a valid address ` };
            }
            let { lat, lng } = r.data.results[0].geometry.location;
            const [location, created] = await this.store.location.findOrCreate({
                where: {
                    name,
                    address,
                    latitude: lat,
                    longitude: lng,
                    organizationId,
                },
            });
            return created ? location.dataValues : { message: "Location Already Created" };
        }
    }
    async createEvent({ name, dateAndTime, description, organizationId }) {
        const [event, created] = await this.store.event.findOrCreate({
            where: { name, dateAndTime: dateAndTime, description, organizationId },
        });
        return created ? event.dataValues : { message: "Event already created" };
    }
    async getOrganization({ id }) {
        const organization = await this.store.organization.findOne({
            where: { id },
        });
        console.log("Getting organization");
        console.log(organization);
        return organization;
    }
    async getLocation({ id }) {
        const location = await this.store.location.findOne({ where: { id } });
        console.log(location);
        return location;
    }
    async getEvent({ id }) {
        const event = await this.store.event.findOne({ where: { id } });
        return event;
    }
    async getOrganizations({ ids }) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getOrganization({ id })));
        }
    }
    async getLocations({ ids }) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getLocation({ id })));
        }
    }
    async getEvents({ ids }) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getEvent({ id })));
        }
    }
    async getAllOrganizations() {
        const organizations = await this.store.organization.findAll();
        return organizations;
    }
    async getAllLocations() {
        const locations = await this.store.location.findAll();
        return locations;
    }
    async getAllEvents() {
        const events = await this.store.event.findAll();
        return events;
    }
    async getAllLocationsByOrgId({ id }) {
        const locations = await this.store.location.findAll({
            where: {
                organizationId: id,
            },
        });
        return locations;
    }
    async getAllEventsByOrgId({ id }) {
        const events = await this.store.event.findAll({
            where: {
                organizationId: id,
            },
        });
        return events;
    }
    async updateOrganization({ id, name }) {
        const results = await this.store.organization.update({ name }, {
            where: {
                id
            }
        });
        return results[0];
    }
    async updateLocation({ id, name, address }) {
        if (address) {
            console.log("Getting New latitude and longitude");
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
                const results = await this.store.location.update(updateObject, {
                    where: {
                        id
                    }
                });
                console.log("results");
                console.log(results);
                return results[0];
            }
        }
        else {
            const results = await this.store.location.update({
                name,
            }, {
                where: {
                    id
                }
            });
            return results[0];
        }
    }
    async updateEvent({ id, name, dateAndTime, description }) {
        console.log('Update Event');
        const updateObject = {};
        if (name)
            updateObject.name = name;
        if (dateAndTime)
            updateObject.dateAndTime = new Date(dateAndTime);
        if (description)
            updateObject.description = description;
        const results = await this.store.event.update(updateObject, {
            where: {
                id
            }
        });
        return results[0];
    }
    async deleteOrganization({ id, }) {
        const organization = await this.store.organization.destroy({ where: { id }, });
        await this.store.location.destroy({
            where: {
                organizationId: id
            }
        });
        await this.store.event.destroy({
            where: {
                organizationId: id
            }
        });
        return organization;
    }
    async deleteLocation({ id }) {
        const location = await this.store.location.destroy({ where: { id } });
        return location;
    }
    async deleteEvent({ id }) {
        const event = await this.store.event.destroy({ where: { id } });
        return event;
    }
}
exports.API = API;
