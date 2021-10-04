import { Context, } from '../../../interfaces/Types'
import { CreateOrganizationArguments, DeleteOrganizationArguments, FindOrganizationArguments, OrganizationType, UpdateOrganizationArguments } from '../../../interfaces/OrganizationTypes'
import { FindLocationArguments, LocationType } from '../../../interfaces/LocationTypes'
import { EventType, FindEventArguments } from '../../../interfaces/EventTypes'

// Queries
// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments
const organization = async (_: any, { id }: FindOrganizationArguments, { dataSources }: Context) => {
    const results = await dataSources.api.organization.getOrganization({ id })
    return results
}
const organizations = async (_: any, { ids }: FindOrganizationArguments, { dataSources }: Context) => {
    const results = await dataSources.api.organization.getOrganizations({ ids })

    return results
}
const allOrganizations = async (_: any, __: any, { dataSources }: Context) => {
    const results = await dataSources.api.organization.getAllOrganizations()
    return results
}

// Mutations
const createOrganization = async (_: any, { name }: CreateOrganizationArguments, { dataSources }: Context) => {
    const results = await dataSources.api.organization.createOrganization({ name });
    return results;
}


const updateOrganization = async (_: any, { id, name }: UpdateOrganizationArguments, { dataSources }: Context) => {
    const results = await dataSources.api.organization.updateOrganization({ id, name });
    return results
}

const deleteOrganization = async (_: any, { id }: DeleteOrganizationArguments, { dataSources }: Context) => {
    await dataSources.api.organization.deleteOrganization({ id });
    await dataSources.api.location.deleteLocationByOrganizationId({ organizationId: id })
    await dataSources.api.event.deleteEventByOrganizationId({ organizationId: id })

    const result = await dataSources.api.organization.getOrganization({ id })
    if (result) {
        return { success: false };
    } else {
        return { success: true }
    }
}

const Organization = {
    locations: async ({ id }: FindLocationArguments, _: any, { dataSources }: Context) => {
        const results = await dataSources.api.location.getAllLocationsByOrgId({ id })
        return results
    },
    events: async ({ id }: FindEventArguments, _: any, { dataSources }: Context) => {
        const results = await dataSources.api.event.getAllEventsByOrgId({ id })
        return results
    }
}

export const resolvers = {
    Query: {
        organization,
        organizations,
        allOrganizations
    },
    Mutation: {
        createOrganization,
        updateOrganization,
        deleteOrganization,
    },
    Organization,

}