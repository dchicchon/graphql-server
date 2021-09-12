const { dateScalar } = require("./scalars");

// Resolver Function Parameters: parent, args, context, info
const resolvers = {
  Query: {
    organization: async (_, { id }, { dataSources }) =>
      dataSources.api.getOrganization({ id }),
    location: async (_, { id }, { dataSources }) =>
      dataSources.api.getLocation({ id }),
    event: async (_, { id }, { dataSources }) =>
      dataSources.api.getEvent({ id }),
    organizations: async (_, { ids }, { dataSources }) =>
      dataSources.api.getOrganizations({ ids }),
    locations: async (_, { ids }, { dataSources }) =>
      dataSources.api.getLocations({ ids }),
    events: async (_, { ids }, { dataSources }) =>
      dataSources.api.getEvents({ ids }),
  },
  Mutation: {
    createOrganization: async (_, { name }, { dataSources }) => {
      const results = await dataSources.api.createOrganization({ name });
      console.log(results);
      return {
        success: results && results.id,
        results,
      };
    },
    createLocation: async (
      _,
      { name, address, latitude, longitude, organizationId },
      { dataSources }
    ) => {
      const results = await dataSources.api.createLocation({
        name,
        address,
        latitude,
        longitude,
        organizationId,
      });
      return {
        success: results && results.id,
        results,
      };
    },
    createEvent: async (
      _,
      { name, dateAndTime, description, organizationId },
      { dataSources }
    ) => {
      const results = await dataSources.api.createEvent({
        name,
        dateAndTime,
        description,
        organizationId,
      });
      return {
        success: results && results.id,
        results,
      };
    },

    updateOrganization: async ({ id }) => {
      const results = dataSources.api.updateOrganization({ id });
      return {
        success: results && results.id,
        results,
      };
    },
    updateLocation: async ({ id }) => {
      const reuslts = dataSources.api.updateLocation({ id });
      return {
        success: results && results.id,
        results,
      };
    },
    updateEvent: async ({ id }) => {
      const results = dataSources.api.updateEvent({ id });
      return {
        success: results && results.id,
        results,
      };
    },

    deleteOrganization: async ({ id }) => {
      const results = dataSources.api.deleteOrganization({ id });
      return {
        success: results && results.id,
        results,
      };
    },
    deleteLocation: async ({ id }) => {
      const results = dataSources.api.deleteLocation({ id });
      return {
        success: results && results.id,
        results,
      };
    },
    deleteEvent: async ({ id }) => {
      const results = dataSources.api.deleteEvent({ id });
      return {
        success: results && results.id,
        results,
      };
    },
  },
  Organization: {
    locations(parent) {
      // parent is going to be the parent typeDef that was called
      return dataSources.api.getAllLocationsByOrgId(parent.id);
    },
    events(parent) {
      return dataSources.api.getAllEventsByOrgId(parent.id);
    },
  },
  Date: dateScalar,
};

module.exports = resolvers;
