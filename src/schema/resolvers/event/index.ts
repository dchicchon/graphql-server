import { DataSourceParent, } from '../../../interfaces/Types'
import { CreateEventArguments, DeleteEventArguments, EventType, FindEventArguments, UpdateEventArguments } from '../../../interfaces/EventTypes'
import { OrganizationType } from '../../../interfaces/OrganizationTypes'

// Queries
// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments
const event = async (_: any, { id }: FindEventArguments, { dataSources }: DataSourceParent) => {

    const results: EventType = await dataSources.api.event.getEvent({ id })
    return results
}
const events = async (_: any, { ids }: FindEventArguments, { dataSources }: DataSourceParent) => {

    const results: Array<EventType> = await dataSources.api.event.getEvents({ ids })
    return results
}
const allEvents = async (_: any, __: any, { dataSources }: DataSourceParent) => {
    const results: Array<EventType> = await dataSources.api.event.getAllEvents()
    return results
}

// Mutations
const createEvent = async (_: any, { name, dateAndTime, description, organizationId }: CreateEventArguments, { dataSources }: DataSourceParent) => {
    const results: EventType = await dataSources.api.event.createEvent({
        name,
        dateAndTime,
        description,
        organizationId,
    });
    return results
}

const updateEvent = async (_: any, { id, name, dateAndTime, description }: UpdateEventArguments, { dataSources }: DataSourceParent) => {
    const results: EventType = await dataSources.api.event.updateEvent({ id, name, dateAndTime, description });
    return results
}

const deleteEvent = async (_: any, { id }: DeleteEventArguments, { dataSources }: DataSourceParent) => {
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
    organization: async ({ organizationId }: FindEventArguments, _: any, { dataSources }: DataSourceParent) => {
        const results: OrganizationType = await dataSources.api.organization.getOrganization({ id: organizationId })
        return results
    }
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