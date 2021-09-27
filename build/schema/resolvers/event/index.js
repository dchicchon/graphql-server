"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const event = async (_, { id }, { dataSources }) => {
    const results = await dataSources.api.event.getEvent({ id });
    return results;
};
const events = async (_, { ids }, { dataSources }) => {
    const results = await dataSources.api.event.getEvents({ ids });
    return results;
};
const allEvents = async (_, __, { dataSources }) => {
    const results = await dataSources.api.event.getAllEvents();
    return results;
};
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
    return results;
};
const deleteEvent = async (_, { id }, { dataSources }) => {
    const deleteResults = await dataSources.api.event.deleteEvent({ id });
    const findResults = await dataSources.api.event.getEvent({ id });
    if (findResults) {
        return {
            success: false
        };
    }
    return {
        success: true
    };
};
const Event = {
    organization: async ({ organizationId }, _, { dataSources }) => {
        const results = await dataSources.api.organization.getOrganization({ id: organizationId });
        return results;
    }
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
