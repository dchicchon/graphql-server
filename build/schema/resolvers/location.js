"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const location = async (_, { id }, { dataSources }) => dataSources.api.location.getLocation({ id });
const locations = async (_, { ids }, { dataSources }) => dataSources.api.location.getLocations({ ids });
const allLocations = async (_, __, { dataSources }) => dataSources.api.location.getAllLocations();
const createLocation = async (_, { name, address, organizationId }, { dataSources }) => {
    const results = await dataSources.api.location.createLocation({
        name,
        address,
        organizationId,
    });
    return results;
};
const updateLocation = async (_, { id, name, address }, { dataSources }) => {
    const results = await dataSources.api.location.updateLocation({ id, name, address });
    if (results.message)
        return results;
    return {
        success: results && results,
    };
};
const deleteLocation = async (_, { id }, { dataSources }) => {
    const results = await dataSources.api.location.deleteLocation({ id });
    return {
        success: results && results
    };
};
const Location = {
    organization: async ({ organizationId }, _, { dataSources }) => dataSources.api.organization.getOrganization({ id: organizationId })
};
exports.resolvers = {
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
};
