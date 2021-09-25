import { Arguments, DataSourceParent, } from '../../interfaces/Types'


// Queries
const location = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {
    const result = await dataSources.api.location.getLocation({ id })
    return result
}
const locations = async (_: any, { ids }: Arguments, { dataSources }: DataSourceParent) => {
    const result = await dataSources.api.location.getLocations({ ids })
    return result
}
const allLocations = async (_: any, __: any, { dataSources }: DataSourceParent) => {
    const result = await dataSources.api.location.getAllLocations()
    return result
}
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
    // console.log("Update Location in Resolvers")
    const updateResult = await dataSources.api.location.updateLocation({ id, name, address });
    return updateResult
}

const deleteLocation = async (_: any, { id }: Arguments, { dataSources }: DataSourceParent) => {
    const results = await dataSources.api.location.deleteLocation({ id });

    const findResult = await dataSources.api.location.getLocation({ id })
    if (findResult) {
        return {
            success: false
        }
    } else {
        return {
            success: true
        }
    }
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