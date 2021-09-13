const { DataSource } = require("apollo-datasource");
const { Client } = require('@googlemaps/google-maps-services-js')

class API extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  // =========================
  // CREATE
  // =========================
  async createOrganization({ name }) {
    const [organization, created] = await this.store.organization.findOrCreate({
      where: {
        name,
      },
    });

    return created ? organization.dataValues : { message: "Organization Already Created" };
  }
  async createLocation({ name, address, organizationId }) {

    // At this point in the code, I should be using Google Maps API to check if the 
    // address provided is a valid address that can be called upon
    const client = new Client()
    let r;
    try {
      r = client.geocode({
        params: {
          address: address,
          key: 'AIzaSyCuYKn_98OwaiuVoEoewx603vCtzGZbHck'
        },
        timeout: 3000 // milliseconds
      })
    } catch (e) {
      return { message: e.response.data.error_message }
    } finally {
      if (!r) {
        return { message: `Location:${address} was not found. Please check out the README.md or https://developers.google.com/maps/documentation/geocoding/overview in order to understand how to place a valid address ` }
      }
      let { lat, lng } = r.data.results[0].geometry.location
      const [location, created] = this.store.location.findOrCreate({
        where: {
          name,
          address,
          latitude: lat,
          longitude: lng,
          organizationId,
        },
      });
      return created ? location.dataValues : { message: "Location Already Created" }
    }


  }
  async createEvent({ name, date, time, description, organizationId }) {
    const [event, created] = await this.store.event.findOrCreate({
      where: { name, date, time, description, organizationId },
    });
    return created ? event.dataValues : { message: "Event already created" };
  }
  // END CREATE

  // =========================
  // READ
  // =========================
  async getOrganization({ id }) {
    const organization = await this.store.organization.findOne({
      where: { id },
    });
    return organization
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

  // END READ

  // =========================
  // UPDATE
  // =========================

  async updateOrganization({ id, name }) {
    const results = await this.store.organization.update(
      { name, updatedAt: new Date() },
      {
        where: {
          id
        }
      });
    return results[0];
  }
  async updateLocation({ id, name, address }) {

    if (address) {
      const client = new Client()
      let r
      try {
        r = await client.geocode({
          params: {
            address: address,
            key: 'AIzaSyCuYKn_98OwaiuVoEoewx603vCtzGZbHck'
          },
          timeout: 3000 // milliseconds
        })

      } catch (e) {
        return { message: e.response.data.error_message }
      } finally {
        if (!r) {
          return { message: `Location:${address} was not found. Please check out the README.md or https://developers.google.com/maps/documentation/geocoding/overview in order to understand how to place a valid address ` }
        }
        let { lat, lng } = r.data.results[0].geometry.location
        const results = await this.store.location.update({
          name,
          address,
          latitude: lat,
          longitude: lng,
          updatedAt: new Date()
        }, {
          where: {
            id
          }
        });
        return results[0]
      }
    } else {
      const results = await this.store.location.update({
        name,
        updatedAt: new Date()
      }, {
        where: {
          id
        }
      });
      return results[0]
    }



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
    return results[0];
  }
  // END UPDATE

  // =========================
  // DELETE
  // =========================
  async deleteOrganization({ id }) {
    const organization = await this.store.organization.destroy({ where: { id }, });

    // delete all events and locations associated with this organization if they exist
    await this.deleteLocation({ id })
    await this.deleteEvent({ id })

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
