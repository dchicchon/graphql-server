"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.allEvents = exports.events = exports.event = void 0;
const event = async (_, { id }, { dataSources }) => dataSources.api.getEvent({ id });
exports.event = event;
const events = async (_, { ids }, { dataSources }) => dataSources.api.getEvents({ ids });
exports.events = events;
const allEvents = async (_, __, { dataSources }) => dataSources.api.getAllEvents();
exports.allEvents = allEvents;
const createEvent = async (_, { name, dateAndTime, description, organizationId }, { dataSources }) => {
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
        };
    }
    return {
        success: true,
        results,
    };
};
exports.createEvent = createEvent;
const updateEvent = async (_, { id, name, dateAndTime, description }, { dataSources }) => {
    const results = await dataSources.api.updateEvent({ id, name, dateAndTime, description });
    return {
        success: results && results,
    };
};
exports.updateEvent = updateEvent;
const deleteEvent = async (_, { id }, { dataSources }) => {
    const results = await dataSources.api.deleteEvent({ id });
    return {
        success: results && results
    };
};
exports.deleteEvent = deleteEvent;
exports.Event = {
    organization: async ({ organizationId }, _, { dataSources }) => dataSources.api.getOrganization({ id: organizationId })
};
