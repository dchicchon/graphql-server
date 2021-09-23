import { Arguments, DataSourceParent, } from '../interfaces/Types'


// Queries
export const location = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.getLocation({ id })
export const locations = async (_: any, { ids }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.getLocations({ ids })
export const allLocations = async (_: any, __: any, { dataSources }: DataSourceParent) => dataSources.api.getAllLocations()

// Mutations
export const createLocation = async (_: any, { name, address, organizationId }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.createLocation({
        name,
        address,
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

export const updateLocation = async (_: any, { id, name, address }: Arguments, { dataSources }: DataSourceParent) => {

    const results = await dataSources.api.updateLocation({ id, name, address });
    if (results.message) return results
    return {
        success: results && results,
    };
}

export const deleteLocation = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.deleteLocation({ id });
    return {
        success: results && results
    };
}

export const Location = {
    organization: async ({ organizationId }: Arguments, _: any, { dataSources }: DataSourceParent) => dataSources.api.getOrganization({ id: organizationId })
}