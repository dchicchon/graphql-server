"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const scalars_1 = require("./scalars");
const organization_1 = require("./organization");
const location_1 = require("./location");
const event_1 = require("./event");
exports.resolvers = {
    Query: {
        organization: organization_1.organization,
        location: location_1.location,
        event: event_1.event,
        organizations: organization_1.organizations,
        locations: location_1.locations,
        events: event_1.events,
        allOrganizations: organization_1.allOrganizations,
        allLocations: location_1.allLocations,
        allEvents: event_1.allEvents
    },
    Mutation: {
        createOrganization: organization_1.createOrganization,
        createLocation: location_1.createLocation,
        createEvent: event_1.createEvent,
        updateOrganization: organization_1.updateOrganization,
        updateLocation: location_1.updateLocation,
        updateEvent: event_1.updateEvent,
        deleteOrganization: organization_1.deleteOrganization,
        deleteLocation: location_1.deleteLocation,
        deleteEvent: event_1.deleteEvent,
    },
    Organization: organization_1.Organization,
    Location: location_1.Location,
    Event: event_1.Event,
    DataObject: {
        __anyresolveType(obj) {
            if (obj.description)
                return 'Event';
            if (obj.latitude)
                return 'Location';
            if (obj.name)
                return 'Organization';
            if (obj.message)
                return 'ErrorObject';
            return null;
        }
    },
    Date: scalars_1.Scalars.dateScalar,
};
