const { DataSource } = require('apollo-datasource')

class API extends DataSource {
    constructor({ store }) {
        super();
        this.store = store
    }

    // Need to implement reducers here to return multiple items

    // CREATE
    async createOrganization({ name }) {
        const createdAt = new Date()
        const updatedAt = new Date()
        let organization;
        try {
            organization = await this.store.organization.create({ name, createdAt, updatedAt })
        } catch (error) {
            console.error(error)
        }
        return organization
    }
    async createLocation({ name, address, latitude, longitude, organizationId }) {
        console.log("API")
        console.log(name)
        console.log(address)
        // Get latitude and longitude with Google Maps API
        console.log(latitude)
        console.log(longitude)

        console.log(organizationId)
        const createdAt = new Date()
        const updatedAt = new Date()
        const location = await this.store.location.create({ name, address, latitude, longitude, organizationId, createdAt, updatedAt })
        return location
    }
    async createEvent({ name, dateAndTime, description, organizationId }) {
        console.log("API")
        console.log(name)
        console.log(dateAndTime)
        console.log(description)
        console.log(organizationId)
        const createdAt = new Date()
        const updatedAt = new Date()
        const organization = await this.store.event.create({ name, dateAndTime, description, createdAt, updatedAt })
        return organization
    }
    // END CREATE

    // READ
    async getOrganization({ id }) {
        const organization = await this.store.organization.find({ where: { id: id } })
        console.log(organization)
        return organization
    }
    async getLocation({ id }) {
        const organization = await this.store.location.find({ where: { id: id } })
        console.log(organization)
        return organization
    }
    async getEvent({ id }) {
        const organization = await this.store.event.find({ where: { id: id } })
        console.log(organization)
        return organization
    }
    async getAllOrganizations() {
        const organizations = await this.store.organization.findAll()
        console.log(organizations)
        return organizations
    }
    async getAllLocations() {
        const locations = await this.store.location.findAll()
        return locations
    }
    async getAllEvents() {
        const events = await this.store.event.findAll()
        return events
    }
    // END READ

    // UPDATE
    async updateOrganization({ id, updateObject }) {
        console.log("API")
        console.log(id)
        console.log(updateObject)
        updateObject.updatedAt = new Date()
        const organization = await this.store.organization.update(updateObject)
        return organization
    }
    async updateLocation({ id, updateObject }) {
        console.log("API")
        console.log(id)
        console.log(updateObject)
        updateObject.updatedAt = new Date()
        const location = await this.store.location.update(updateObject)
        return location
    }
    async updateEvent({ id, updateObject }) {
        console.log("API")
        console.log(id)
        console.log(updateObject)
        updateObject.updatedAt = new Date()
        const event = await this.store.event.update(updateObject)
        return event
    }
    // END UPDATE

    // DELETE
    async deleteOrganization({ id }) {
        console.log("API")
        console.log(id)
        const organization = await this.store.organization.destroy({ where: { id } })
        return organization
    }
    async deleteLocation({ id }) {
        console.log("API")
        console.log(id)
        const location = await this.store.location.destroy({ where: { id } })
        return location
    }
    async deleteEvent({ id }) {
        console.log("API")
        console.log(id)
        const event = await this.store.event.destroy({ where: { id } })
        return event
    }

    // END DELETE

}

module.exports = API