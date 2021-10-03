import { DataSourceParent, } from '../../../interfaces/Types'
import { CreateOrganizationArguments, DeleteOrganizationArguments, FindOrganizationArguments, OrganizationType, UpdateOrganizationArguments } from '../../../interfaces/OrganizationTypes'
import { FindLocationArguments, LocationType } from '../../../interfaces/LocationTypes'
import { EventType, FindEventArguments } from '../../../interfaces/EventTypes'

// Queries
// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments
const organization = async (_: any, { id }: FindOrganizationArguments, { dataSources }: DataSourceParent) => {
    const results: OrganizationType = await dataSources.api.organization.getOrganization({ id })
    return results
}
const organizations = async (_: any, { ids }: FindOrganizationArguments, { dataSources }: DataSourceParent) => {
    const results: Array<OrganizationType> = await dataSources.api.organization.getOrganizations({ ids })

    return results
}
const allOrganizations = async (_: any, __: any, { dataSources }: DataSourceParent) => {
    const results: Array<OrganizationType> = await dataSources.api.organization.getAllOrganizations()
    return results
}

// Mutations
const createOrganization = async (_: any, { name }: CreateOrganizationArguments, { dataSources }: DataSourceParent) => {
    const results: OrganizationType = await dataSources.api.organization.createOrganization({ name });
    return results;
}


const updateOrganization = async (_: any, { id, name }: UpdateOrganizationArguments, { dataSources }: DataSourceParent) => {
    const results: OrganizationType = await dataSources.api.organization.updateOrganization({ id, name });
    return results
}

const deleteOrganization = async (_: any, { id }: DeleteOrganizationArguments, { dataSources }: DataSourceParent) => {
    // console.log('Delete Organization in Resolvers')
    const deleteOrganizationResults = await dataSources.api.organization.deleteOrganization({ id });
    // console.log(deleteOrganizationResults)
    const deleteLocationResults = await dataSources.api.location.deleteLocationByOrganizationId({ organizationId: id })
    // console.log(deleteLocationResults)
    const deleteEventResults = await dataSources.api.event.deleteEventByOrganizationId({ organizationId: id })
    // console.log(deleteEventResults)

    // try to find the organization by the id
    const result = await dataSources.api.organization.getOrganization({ id })
    // this should come as empty
    if (result) {
        return { success: false };
    } else {
        return { success: true }
    }
}

const Organization = {
    locations: async ({ id }: FindLocationArguments, _: any, { dataSources }: DataSourceParent) => {
        const results: Array<LocationType> = await dataSources.api.location.getAllLocationsByOrgId({ id })
        return results
    },
    events: async ({ id }: FindEventArguments, _: any, { dataSources }: DataSourceParent) => {
        const results: Array<EventType> = await dataSources.api.event.getAllEventsByOrgId({ id })
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