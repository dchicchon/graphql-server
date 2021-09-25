"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const location = async (_, { id }, { dataSources }) => {
    const result = await dataSources.api.location.getLocation({ id });
    return result;
};
const locations = async (_, { ids }, { dataSources }) => {
    const result = await dataSources.api.location.getLocations({ ids });
    return result;
};
const allLocations = async (_, __, { dataSources }) => {
    const result = await dataSources.api.location.getAllLocations();
    return result;
};
const createLocation = async (_, { name, address, organizationId }, { dataSources }) => {
    const results = await dataSources.api.location.createLocation({
        name,
        address,
        organizationId,
    });
    return results;
};
const updateLocation = async (_, { id, name, address }, { dataSources }) => {
    const updateResult = await dataSources.api.location.updateLocation({ id, name, address });
    return updateResult;
};
const deleteLocation = async (_, { id }, { dataSources }) => {
    const results = await dataSources.api.location.deleteLocation({ id });
    const findResult = await dataSources.api.location.getLocation({ id });
    if (findResult) {
        return {
            success: false
        };
    }
    else {
        return {
            success: true
        };
    }
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
