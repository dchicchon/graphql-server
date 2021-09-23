import { Scalars } from './scalars'
import { Arguments, DataSource } from '../interfaces/Types'

// Resolver Function Parameters: parent, args, context, info
const resolvers = {
  Query: {
    organization: async (_: any, { id }: Arguments, { dataSources }: DataSource) => dataSources.api.getOrganization({ id }),
    location: async (_: any, { id }: Arguments, { dataSources }: DataSource) => dataSources.api.getLocation(: Arguments),
    event: async (_: any, { id }: Arguments, { dataSources }: DataSource) => dataSources.api.getEvent({ id }),

    organizations: async (_: any, { ids }: Arguments, { dataSources }: DataSource) => dataSources.api.getOrganizations({ ids }),
    locations: async (_: any, { ids }: Arguments, { dataSources }: DataSource) => dataSources.api.getLocations({ ids }),
    events: async (_: any, { ids }: Arguments, { dataSources }: DataSource) => dataSources.api.getEvents({ ids }),

    allOrganizations: async (_: any, __: any, { dataSources }: DataSource) => dataSources.api.getAllOrganizations(),
    allLocations: async (_: any, __: any, { dataSources }: DataSource) => dataSources.api.getAllLocations(),
    allEvents: async (_: any, __: any, { dataSources }: DataSource) => dataSources.api.getAllEvents()
  },
  Mutation: {
    createOrganization: async (_: any, { name }: Arguments, { dataSources }: DataSource) => {
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
    createLocation: async (_: any, { name, address, organizationId }: Arguments, { dataSources }: DataSource) => {
      const results = await dataSources.api.createLocation({
        name,
        address,
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
    createEvent: async (_: any, { name, dateAndTime, description, organizationId }: Arguments, { dataSources }: DataSource) => {
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
    updateOrganization: async (_: any, { id, name }: Arguments, { dataSources }: DataSource) => {
      const results = dataSources.api.updateOrganization({ id, name });
      return {
        success: results && results,
      };
    },
    updateLocation: async (_: any, { id, name, address }: Arguments, { dataSources }: DataSource) => {

      const results = await dataSources.api.updateLocation({ id, name, address });
      if (results.message) return results
      return {
        success: results && results,
      };
    },
    updateEvent: async (_: any, { id, name, dateAndTime, description }: Arguments, { dataSources }: DataSource) => {
      const results = dataSources.api.updateEvent({ id, name, dateAndTime, description });
      return {
        success: results && results,
      };
    },
    deleteOrganization: async (_: any, { id }: Arguments, { dataSources }: DataSource) => {
      const results = await dataSources.api.deleteOrganization({ id });
      return {
        success: results && results
      };
    },
    deleteLocation: async (_: any, { id }: Arguments, { dataSources }: DataSource) => {
      const results = await dataSources.api.deleteLocation({ id });
      return {
        success: results && results
      };
    },
    deleteEvent: async (_: any, { id }: Arguments, { dataSources }: DataSource) => {
      const results = await dataSources.api.deleteEvent({ id });
      return {
        success: results && results
      };
    },
  },
  Organization: {
    locations: async ({ id }: Arguments, _: any, { dataSources }: DataSource) => dataSources.api.getAllLocationsByOrgId({ id }),
    events: async ({ id }: Arguments, _: any, { dataSources }: DataSource) => dataSources.api.getAllEventsByOrgId({ id })
  },
  Location: {
    organization: async ({ organizationId }: Arguments, _: any, { dataSources }: DataSource) => dataSources.api.getOrganization({ id: organizationId })

  },
  Event: {
    organization: async ({ organizationId }: Arguments, _: any, { dataSources }) => dataSources.api.getOrganization({ id: organizationId })
  }
  ,
  DataObject: {
    anyresolveType(obj, context, info) {
      if (obj.description) return 'Event'
      if (obj.latitude) return 'Location'
      if (obj.name) return 'Organization'
      if (obj.message) return 'ErrorObject'
      return null // returns graphql error
    }
  },
  Date: Scalars.dateScalar,
};

module.exports = resolvers;
