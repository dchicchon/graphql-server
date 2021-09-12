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
    console.log("API");
    console.log(name);
    console.log(address);
    // Get latitude and longitude with Google Maps API
    console.log(latitude);
    console.log(longitude);

    console.log(organizationId);
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
  async createEvent({ name, dateAndTime, description, organizationId }) {
    console.log("API");
    console.log(name);
    console.log(dateAndTime);
    console.log(description);
    console.log(organizationId);
    const [event, created] = await this.store.event.findOrCreate({
      where: { name, dateAndTime, description },
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

  async getAllLocationsByOrgId({ id }) {
    const locations = await this.location.findAll({
      where: {
        organizationId: id,
      },
    });
    return locations;
  }
  async getAllEventsByOrgId({ id }) {
    const events = await this.event.findAll({
      where: {
        organizationId: id,
      },
    });
    return events;
  }
  // END READ

  // UPDATE
  async updateOrganization({ id, updateObject }) {
    console.log("API");
    console.log(id);
    console.log(updateObject);
    updateObject.updatedAt = new Date();
    const organization = await this.store.organization.update(updateObject);
    return organization;
  }
  async updateLocation({ id, updateObject }) {
    console.log("API");
    console.log(id);
    console.log(updateObject);
    updateObject.updatedAt = new Date();
    const location = await this.store.location.update(updateObject);
    return location;
  }
  async updateEvent({ id, updateObject }) {
    console.log("API");
    console.log(id);
    console.log(updateObject);
    updateObject.updatedAt = new Date();
    const event = await this.store.event.update(updateObject);
    return event;
  }
  // END UPDATE

  // DELETE
  async deleteOrganization({ id }) {
    console.log("API");
    console.log(id);
    const organization = await this.store.organization.destroy({
      where: { id },
    });
    return organization;
  }
  async deleteLocation({ id }) {
    console.log("API");
    console.log(id);
    const location = await this.store.location.destroy({ where: { id } });
    return location;
  }
  async deleteEvent({ id }) {
    console.log("API");
    console.log(id);
    const event = await this.store.event.destroy({ where: { id } });
    return event;
  }

  // END DELETE
}

module.exports = API;
