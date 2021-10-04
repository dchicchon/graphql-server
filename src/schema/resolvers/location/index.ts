import { Arguments, Context, } from '../../../interfaces/Types'
import { CreateLocationArguments, DeleteLocationArguments, FindLocationArguments, LocationType, UpdateLocationArguments } from '../../../interfaces/LocationTypes'

const location = async (_: undefined, { id }: FindLocationArguments, { dataSources }: Context) => {
    const result = await dataSources.api.location.getLocation({ id })
    return result
}
const locations = async (_: undefined, { ids }: FindLocationArguments, { dataSources }: Context) => {
    const result = await dataSources.api.location.getLocations({ ids })
    return result
}
const allLocations = async (_: undefined, __: undefined, { dataSources }: Context) => {
    const result = await dataSources.api.location.getAllLocations()
    return result
}
const createLocation = async (_: undefined, { name, address, organizationId }: CreateLocationArguments, { dataSources }: Context) => {
    const results = await dataSources.api.location.createLocation({
        name,
        address,
        organizationId,
    });
    return results

}

const updateLocation = async (_: undefined, { id, name, address }: UpdateLocationArguments, { dataSources }: Context) => {
    const updateResult = await dataSources.api.location.updateLocation({ id, name, address });
    return updateResult
}

const deleteLocation = async (_: undefined, { id }: DeleteLocationArguments, { dataSources }: Context) => {
    await dataSources.api.location.deleteLocation({ id });

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
    organization: async ({ organizationId }: FindLocationArguments, _: undefined, { dataSources }: Context) => {
        const results = await dataSources.api.organization.getOrganization({ id: organizationId })
        return results
    }
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