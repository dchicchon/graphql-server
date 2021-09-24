import { Arguments, DataSourceParent, } from '../../interfaces/Types'

// Queries
const organization = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.organization.getOrganization({ id })
const organizations = async (_: any, { ids }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.organization.getOrganizations({ ids })
const allOrganizations = async (_: any, __: any, { dataSources }: DataSourceParent) => dataSources.api.organization.getAllOrganizations()

// Mutations
const createOrganization = async (_: any, { name }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.organization.createOrganization({ name });
    return results;
}


const updateOrganization = async (_: any, { id, name }: Arguments, { dataSources }: DataSourceParent) => {
    // console.log("Update Org in Resolvers")
    const results = await dataSources.api.organization.updateOrganization({ id, name });
    // console.log("Resolver Results")
    // console.log(results)
    return results
}

const deleteOrganization = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {
    // console.log("Delete Organization in Resolvers")
    const deleteOrganizationResults = await dataSources.api.organization.deleteOrganization({ id });
    // console.log(deleteOrganizationResults)
    const deleteLocationResults = await dataSources.api.location.deleteLocationByOrganizationId({ organizationId: id })
    // console.log(deleteLocationResults)
    const deleteEventResults = await dataSources.api.event.deleteEventByOrganizationId({ organizationId: id })
    // console.log(deleteEventResults)
    return { success: !!deleteOrganizationResults };
}

const Organization = {
    locations: async ({ id }: Arguments, _: any, { dataSources }: DataSourceParent) => dataSources.api.location.getAllLocationsByOrgId({ id }),
    events: async ({ id }: Arguments, _: any, { dataSources }: DataSourceParent) => dataSources.api.event.getAllEventsByOrgId({ id })
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