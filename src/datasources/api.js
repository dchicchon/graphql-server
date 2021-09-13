const { DataSource } = require("apollo-datasource");

class API extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  // Need to implement reducers here to return multiple items

  // CREATE
  async createOrganization({ name }) {
    const [organization, created] = await this.store.organization.findOrCreate({
      where: {
        name,
      },
    });
    return created ? organization.dataValues : false;
  }
  async createLocation({ name, address, latitude, longitude, organizationId }) {
    const [location, created] = await this.store.location.findOrCreate({
      where: {
        name,
        address,
        latitude,
        longitude,
        organizationId,
      },
    });
    return created ? location.dataValues : false;
  }
  async createEvent({ name, date, time, description, organizationId }) {
    const [event, created] = await this.store.event.findOrCreate({
      where: { name, date, time, description, organizationId },
    });
    return created ? event.dataValues : false;
  }
  // END CREATE

  // READ
  async getOrganization({ id }) {
    console.log("Get Organization");
    console.log(id);
    const organization = await this.store.organization.findOne({
      where: { id },
    });
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
    console.log("Get Organizations");
    console.log(ids);
    return Promise.all(ids.map((id) => this.getOrganization({ id })));
  }
  async getLocations({ ids }) {
    return Promise.all(ids.map((id) => this.getLocation({ id })));
  }
  async getEvents({ ids }) {
    return Promise.all(ids.map((id) => this.getEvent({ id })));
  }

  async getAllOrganizations() {
    const organizations = await this.store.organization.findAll();
    return organizations;
  }
  async getAllLocations() {
    const locations = await this.store.location.findAll();
    return locations
  }
  async getAllEvents() {
    const events = await this.store.event.findAll();
    return events

  }

  async getAllLocationsByOrgId({ id }) {
    console.log("")
    console.log(id)
    const locations = await this.store.location.findAll({
      where: {
        organizationId: id,
      },
    });
    console.log("Got locations for Organization")
    console.log(locations)
    return locations;
  }
  async getAllEventsByOrgId({ id }) {
    const events = await this.store.event.findAll({
      where: {
        organizationId: id,
      },
    });
    console.log("Got events for Organization")
    console.log(events)
    return events;
  }

  // END READ

  // UPDATE
  async updateOrganization({ id, name }) {
    console.log("Update Organization")
    const results = await this.store.organization.update(
      { name, updatedAt: new Date() },
      {
        where: {
          id
        }
      });
    console.log(results)
    return results[0];
  }
  async updateLocation({ id, name, address, latitude, longitude }) {
    const results = await this.store.location.update(
      {
        name, address, latitude, longitude, updatedAt: new Date()
      },
      {
        where: { id }
      });
    return results;
  }
  async updateEvent({ id, name, date, time, description }) {
    updateObject.updatedAt = new Date();
    const results = await this.store.event.update(
      {
        name, date, time, description, updatedAt: new Date()
      },
      {
        where: {
          id
        }
      });
    return results;
  }
  // END UPDATE

  // DELETE
  async deleteOrganization({ id }) {
    const organization = await this.store.organization.destroy({ where: { id }, });
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

  // END DELETE
}

module.exports = API;
