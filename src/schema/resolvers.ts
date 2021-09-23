import { Scalars } from './scalars'
import { DatabaseObject } from '../interfaces/Types'
import { Organization, organization, organizations, allOrganizations, createOrganization, updateOrganization, deleteOrganization } from './organization';
import { Location, location, locations, allLocations, createLocation, updateLocation, deleteLocation } from './location'
import { Event, event, events, allEvents, createEvent, updateEvent, deleteEvent } from './event'
// Resolver Function Parameters: parent, args, context, info

const resolvers = {
  Query: {
    organization,
    location,
    event,

    organizations,
    locations,
    events,

    allOrganizations,
    allLocations,
    allEvents
  },

  Mutation: {
    // Create
    createOrganization,
    createLocation,
    createEvent,
    // Update
    updateOrganization,
    updateLocation,
    updateEvent,
    // Delete
    deleteOrganization,
    deleteLocation,
    deleteEvent,
  },
  // For resolver cha
  Organization,
  Location,
  Event,

  // Data Object that will be returned from api
  DataObject: {
    __anyresolveType(obj: DatabaseObject) {
      if (obj.description) return 'Event'
      if (obj.latitude) return 'Location'
      if (obj.name) return 'Organization'
      if (obj.message) return 'ErrorObject'
      return null // returns graphql error
    }
  },
  Date: Scalars.dateScalar,
};

export default resolvers