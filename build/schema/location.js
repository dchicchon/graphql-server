"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = exports.deleteLocation = exports.updateLocation = exports.createLocation = exports.allLocations = exports.locations = exports.location = void 0;
const location = async (_, { id }, { dataSources }) => dataSources.api.getLocation({ id });
exports.location = location;
const locations = async (_, { ids }, { dataSources }) => dataSources.api.getLocations({ ids });
exports.locations = locations;
const allLocations = async (_, __, { dataSources }) => dataSources.api.getAllLocations();
exports.allLocations = allLocations;
const createLocation = async (_, { name, address, organizationId }, { dataSources }) => {
    const results = await dataSources.api.createLocation({
        name,
        address,
        organizationId,
    });
    if (results.message) {
        return {
            success: false,
            results
        };
    }
    return {
        success: true,
        results,
    };
};
exports.createLocation = createLocation;
const updateLocation = async (_, { id, name, address }, { dataSources }) => {
    const results = await dataSources.api.updateLocation({ id, name, address });
    if (results.message)
        return results;
    return {
        success: results && results,
    };
};
exports.updateLocation = updateLocation;
const deleteLocation = async (_, { id }, { dataSources }) => {
    const results = await dataSources.api.deleteLocation({ id });
    return {
        success: results && results
    };
};
exports.deleteLocation = deleteLocation;
exports.Location = {
    organization: async ({ organizationId }, _, { dataSources }) => dataSources.api.getOrganization({ id: organizationId })
};
