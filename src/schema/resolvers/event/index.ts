import { Context, } from '../../../interfaces/Types'
import { CreateEventArguments, DeleteEventArguments, EventType, FindEventArguments, UpdateEventArguments } from '../../../interfaces/EventTypes'
import { OrganizationType } from '../../../interfaces/OrganizationTypes'

// Queries
// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments
const event = async (_: undefined, { id }: FindEventArguments, { dataSources }: Context) => {

    const results = await dataSources.api.event.getEvent({ id })
    return results
}
const events = async (_: undefined, { ids }: FindEventArguments, { dataSources }: Context) => {

    const results = await dataSources.api.event.getEvents({ ids })
    return results
}
const allEvents = async (_: undefined, __: undefined, { dataSources }: Context) => {
    const results = await dataSources.api.event.getAllEvents()
    return results
}

// Mutations
const createEvent = async (_: undefined, { name, dateAndTime, description, organizationId }: CreateEventArguments, { dataSources }: Context) => {
    const results = await dataSources.api.event.createEvent({
        name,
        dateAndTime,
        description,
        organizationId,
    });
    return results
}

const updateEvent = async (_: undefined, { id, name, dateAndTime, description }: UpdateEventArguments, { dataSources }: Context) => {
    const results = await dataSources.api.event.updateEvent({ id, name, dateAndTime, description });
    return results
}

const deleteEvent = async (_: undefined, { id }: DeleteEventArguments, { dataSources }: Context) => {
    await dataSources.api.event.deleteEvent({ id });
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
    organization: async ({ organizationId }: FindEventArguments, _: undefined, { dataSources }: Context) => {
        const results = await dataSources.api.organization.getOrganization({ id: organizationId })
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
        createEvent,
        updateEvent,
        deleteEvent,
    },
    Event,

}