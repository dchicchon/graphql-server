import { Arguments, DataSourceParent, } from '../../interfaces/Types'


// Queries
const event = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {

    const results = await dataSources.api.event.getEvent({ id })
    return results
}
const events = async (_: any, { ids }: Arguments, { dataSources }: DataSourceParent) => {

    const results = await dataSources.api.event.getEvents({ ids })
    return results
}
const allEvents = async (_: any, __: any, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.event.getAllEvents()
    return results
}

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
    return results
}

const deleteEvent = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {
    const deleteResults = await dataSources.api.event.deleteEvent({ id });
    const findResults = await dataSources.api.event.getEvent({ id })
    if (findResults) {
        return {
            success: false
        }
    }
    return {
        success: true
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