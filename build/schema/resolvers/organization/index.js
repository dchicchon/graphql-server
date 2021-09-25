"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const organization = async (_, { id }, { dataSources }) => {
    const results = await dataSources.api.organization.getOrganization({ id });
    return results;
};
const organizations = async (_, { ids }, { dataSources }) => {
    const results = await dataSources.api.organization.getOrganizations({ ids });
    return results;
};
const allOrganizations = async (_, __, { dataSources }) => {
    const results = await dataSources.api.organization.getAllOrganizations();
    return results;
};
const createOrganization = async (_, { name }, { dataSources }) => {
    const results = await dataSources.api.organization.createOrganization({ name });
    return results;
};
const updateOrganization = async (_, { id, name }, { dataSources }) => {
    const results = await dataSources.api.organization.updateOrganization({ id, name });
    return results;
};
const deleteOrganization = async (_, { id }, { dataSources }) => {
    const deleteOrganizationResults = await dataSources.api.organization.deleteOrganization({ id });
    const deleteLocationResults = await dataSources.api.location.deleteLocationByOrganizationId({ organizationId: id });
    const deleteEventResults = await dataSources.api.event.deleteEventByOrganizationId({ organizationId: id });
    const result = await dataSources.api.organization.getOrganization({ id });
    if (result) {
        return { success: false };
    }
    else {
        return { success: true };
    }
};
const Organization = {
    locations: async ({ id }, _, { dataSources }) => {
        const results = await dataSources.api.location.getAllLocationsByOrgId({ id });
        return results;
    },
    events: async ({ id }, _, { dataSources }) => {
        const results = await dataSources.api.event.getAllEventsByOrgId({ id });
        return results;
    }
};
exports.resolvers = {
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
};
