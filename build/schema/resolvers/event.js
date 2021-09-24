"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const event = async (_, { id }, { dataSources }) => dataSources.api.event.getEvent({ id });
const events = async (_, { ids }, { dataSources }) => dataSources.api.event.getEvents({ ids });
const allEvents = async (_, __, { dataSources }) => dataSources.api.event.getAllEvents();
const createEvent = async (_, { name, dateAndTime, description, organizationId }, { dataSources }) => {
    const results = await dataSources.api.event.createEvent({
        name,
        dateAndTime,
        description,
        organizationId,
    });
    return results;
};
const updateEvent = async (_, { id, name, dateAndTime, description }, { dataSources }) => {
    const results = await dataSources.api.event.updateEvent({ id, name, dateAndTime, description });
    return {
        success: results && results,
    };
};
const deleteEvent = async (_, { id }, { dataSources }) => {
    const results = await dataSources.api.event.deleteEvent({ id });
    return {
        success: results && results
    };
};
const Event = {
    organization: async ({ organizationId }, _, { dataSources }) => dataSources.api.organization.getOrganization({ id: organizationId })
};
exports.resolvers = {
    Query: {
        event,
        events,
        allEvents
    },
    Mutation: {
        createEvent,
        updateEvent,
        deleteEvent,
    },
    Event,
};
