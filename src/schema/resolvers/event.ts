import { Arguments, DataSourceParent, } from '../../interfaces/Types'


// Queries
const event = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.event.getEvent({ id })
const events = async (_: any, { ids }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.event.getEvents({ ids })
const allEvents = async (_: any, __: any, { dataSources }: DataSourceParent) => dataSources.api.event.getAllEvents()

// Mutations
const createEvent = async (_: any, { name, dateAndTime, description, organizationId }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.event.createEvent({
        name,
        dateAndTime,
        description,
        organizationId,
    });
    return results
}

const updateEvent = async (_: any, { id, name, dateAndTime, description }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.event.updateEvent({ id, name, dateAndTime, description });
    return {
        success: results && results,
    };
}

const deleteEvent = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.event.deleteEvent({ id });
    return {
        success: results && results
    };
}

const Event = {
    organization: async ({ organizationId }: Arguments, _: any, { dataSources }: DataSourceParent) => dataSources.api.organization.getOrganization({ id: organizationId })
}

export const resolvers = {
    Query: {
        event,

        events,

        allEvents
    },

    Mutation: {
        // Create
        createEvent,
        // Update
        updateEvent,
        // Delete
        deleteEvent,
    },
    // For resolver cha
    Event,

}