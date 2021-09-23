import { Arguments, DataSourceParent, } from '../interfaces/Types'


// Queries
export const event = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.getEvent({ id })
export const events = async (_: any, { ids }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.getEvents({ ids })
export const allEvents = async (_: any, __: any, { dataSources }: DataSourceParent) => dataSources.api.getAllEvents()

// Mutations
export const createEvent = async (_: any, { name, dateAndTime, description, organizationId }: Arguments, { dataSources }: DataSourceParent) => {
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
}

export const updateEvent = async (_: any, { id, name, dateAndTime, description }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.updateEvent({ id, name, dateAndTime, description });
    return {
        success: results && results,
    };
}

export const deleteEvent = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.deleteEvent({ id });
    return {
        success: results && results
    };
}

export const Event = {
    organization: async ({ organizationId }: Arguments, _: any, { dataSources }: DataSourceParent) => dataSources.api.getOrganization({ id: organizationId })
}