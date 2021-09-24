import { Arguments, DataSourceParent, } from '../../interfaces/Types'


// Queries
const location = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.location.getLocation({ id })
const locations = async (_: any, { ids }: Arguments, { dataSources }: DataSourceParent) => dataSources.api.location.getLocations({ ids })
const allLocations = async (_: any, __: any, { dataSources }: DataSourceParent) => dataSources.api.location.getAllLocations()

// Mutations
const createLocation = async (_: any, { name, address, organizationId }: Arguments, { dataSources }: DataSourceParent) => {
    // console.log("Create Location Resolver")
    // console.log(name, address, organizationId)
    const results = await dataSources.api.location.createLocation({
        name,
        address,
        organizationId,
    });
    return results

}

const updateLocation = async (_: any, { id, name, address }: Arguments, { dataSources }: DataSourceParent) => {

    const results = await dataSources.api.location.updateLocation({ id, name, address });
    if (results.message) return results
    return {
        success: results && results,
    };
}

const deleteLocation = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.location.deleteLocation({ id });
    return {
        success: results && results
    };
}

const Location = {
    organization: async ({ organizationId }: Arguments, _: any, { dataSources }: DataSourceParent) => dataSources.api.organization.getOrganization({ id: organizationId })
}

export const resolvers = {
    Query: {
        location,
        locations,
        allLocations,
    },
    Mutation: {
        createLocation,
        updateLocation,
        deleteLocation,

    },

    Location,
}