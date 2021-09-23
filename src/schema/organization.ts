import { Arguments, DataSourceParent, } from '../interfaces/Types'


// Queries
export const organization = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.getOrganization({ id })
export const organizations = async (_: any, { ids }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.getOrganizations({ ids })
export const allOrganizations = async (_: any, __: any, { dataSources }: DataSourceParent) => dataSources.api.getAllOrganizations()

// Mutations
export const createOrganization = async (_: any, { name }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.createOrganization({ name });
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
export const updateOrganization = async (_: any, { id, name }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.updateOrganization({ id, name });
    return {
        success: results && results,
    };
}

export const deleteOrganization = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.deleteOrganization({ id });
    return {
        success: results && results
    };
}

export const Organization = {
    locations: async ({ id }: Arguments, _: any, { dataSources }: DataSourceParent) => dataSources.api.getAllLocationsByOrgId({ id }),
    events: async ({ id }: Arguments, _: any, { dataSources }: DataSourceParent) => dataSources.api.getAllEventsByOrgId({ id })
}