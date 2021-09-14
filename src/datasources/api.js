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
      r = await client.geocode({
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY
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
      const [location, created] = await this.store.location.findOrCreate({
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
  async createEvent({ name, dateAndTime, description, organizationId }) {
    const [event, created] = await this.store.event.findOrCreate({
      where: { name, dateAndTime: dateAndTime, description, organizationId },
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
    console.log("Getting organization")
    console.log(organization)
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
  // END CREATE

  // =========================
  // UPDATE
  // =========================
  // Maybe for update I should be accepting an updateObject
  async updateOrganization({ id, name }) {
    const results = await this.store.organization.update(
      { name },
      {
        where: {
          id
        }
      });
    return results[0];
  }

  // For some reason, updated at is not working, should check up on this
  async updateLocation({ id, name, address }) {
    if (address) {
      console.log("Getting New latitude and longitude")
      const client = new Client()
      let r
      try {
        r = await client.geocode({
          params: {
            address: address,
            key: process.env.GOOGLE_MAPS_API_KEY
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
        const updateObject = {}
        if (name) updateObject.name = name;
        updateObject.address = address
        updateObject.latitude = lat
        updateObject.longitude = lng
        const results = await this.store.location.update(updateObject, {
          where: {
            id
          }
        });
        console.log("results")
        console.log(results)
        return results[0]
      }
    } else {
      const results = await this.store.location.update({
        name,
      }, {
        where: {
          id
        }
      });
      return results[0]
    }



  }
  async updateEvent({ id, name, dateAndTime, description }) {
    console.log('Update Event')
    const updateObject = {}
    if (name) updateObject.name = name;
    if (dateAndTime) updateObject.dateAndTime = new Date(dateAndTime)
    if (description) updateObject.description = description
    const results = await this.store.event.update(updateObject,
      {
        where: {
          id
        }
      });
    // Maybe do a quick find event to return 
    return results[0]
  }
  // END UPDATE
  // =========================
  // DELETE
  // =========================
  async deleteOrganization({ id, }) {
    const organization = await this.store.organization.destroy({ where: { id }, });
    // delete all events and locations associated with this organization if they exist
    await this.store.location.destroy({
      where: {
        organizationId: id
      }
    })
    await this.store.event.destroy({
      where: {
        organizationId: id
      }
    })

    // This would delete all locations and events that match the id, not necessarily the organizations events or locations
    // await this.deleteLocation({ id })
    // await this.deleteEvent({ id })
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
