const { dateScalar } = require("./scalars");

// Resolver Function Parameters: parent, args, context, info
const resolvers = {
  Query: {
    organization: async (_, { id }, { dataSources }) => dataSources.api.getOrganization({ id }),
    location: async (_, { id }, { dataSources }) => dataSources.api.getLocation({ id }),
    event: async (_, { id }, { dataSources }) => dataSources.api.getEvent({ id }),
    organizations: async (_, { ids }, { dataSources }) => dataSources.api.getOrganizations({ ids }),
    locations: async (_, { ids }, { dataSources }) => dataSources.api.getLocations({ ids }),
    events: async (_, { ids }, { dataSources }) => dataSources.api.getEvents({ ids }),
    allOrganizations: async (_, __, { dataSources }) => dataSources.api.getAllOrganizations(),
    allLocations: async (_, __, { dataSources }) => dataSources.api.getAllLocations(),
    allEvents: async (_, __, { dataSources }) => dataSources.api.getAllEvents()
  },
  Mutation: {
    createOrganization: async (_, { name }, { dataSources }) => {
      const results = await dataSources.api.createOrganization({ name });
      if (results.message) {
        return {
          success: false,
          results
        }
      }
      return {
        success: true,
        results,
      };
    },
    createLocation: async (_, { name, address, organizationId }, { dataSources }) => {
      const results = await dataSources.api.createLocation({
        name,
        address,
        organizationId,
      });
      console.log(results)
      if (results.message) {
        return {
          success: false,
          results
        }
      }
      return {
        success: true,
        results,
      };
    },
    createEvent: async (_, { name, dateAndTime, description, organizationId }, { dataSources }) => {
      const results = await dataSources.api.createEvent({
        name,
        dateAndTime,
        description,
        organizationId,
      });
      if (results.message) {
        return {
          success: false,
          results
        }
      }
      return {
        success: true,
        results,
      };
    },
    updateOrganization: async (_, { id, name }, { dataSources }) => {
      const results = dataSources.api.updateOrganization({ id, name });
      return {
        success: results && results,
      };
    },
    updateLocation: async (_, { id, name, address }, { dataSources }) => {

      const results = await dataSources.api.updateLocation({ id, name, address });
      if (results.message) return results
      return {
        success: results && results,
      };
    },
    updateEvent: async (_, { id, name, dateAndTime, description }, { dataSources }) => {
      const results = dataSources.api.updateEvent({ id, name, dateAndTime, description });
      return {
        success: results && results,
      };
    },
    deleteOrganization: async (_, { id }, { dataSources }) => {
      const results = await dataSources.api.deleteOrganization({ id });
      return {
        success: results && results
      };
    },
    deleteLocation: async (_, { id }, { dataSources }) => {
      const results = await dataSources.api.deleteLocation({ id });
      return {
        success: results && results
      };
    },
    deleteEvent: async (_, { id }, { dataSources }) => {
      const results = await dataSources.api.deleteEvent({ id });
      return {
        success: results && results
      };
    },
  },
  Organization: {
    locations: async ({ id }, _, { dataSources }) => dataSources.api.getAllLocationsByOrgId({ id }),
    events: async ({ id }, _, { dataSources }) => dataSources.api.getAllEventsByOrgId({ id })
  },
  Location: {
    organization: async ({ organizationId }, _, { dataSources }) => dataSources.api.getOrganization({ id: organizationId })

  },
  Event: {
    organization: async ({ organizationId }, _, { dataSources }) => dataSources.api.getOrganization({ id: organizationId })
  }
  ,
  DataObject: {
    __resolveType(obj, context, info) {
      if (obj.description) return 'Event'
      if (obj.latitude) return 'Location'
      if (obj.name) return 'Organization'
      if (obj.message) return 'ErrorObject'
      return null // returns graphql error
    }
  },
  Date: dateScalar,
};

module.exports = resolvers;
