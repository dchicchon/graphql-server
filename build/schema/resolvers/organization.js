"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const organization = async (_, { id }, { dataSources }) => dataSources.api.organization.getOrganization({ id });
const organizations = async (_, { ids }, { dataSources }) => dataSources.api.organization.getOrganizations({ ids });
const allOrganizations = async (_, __, { dataSources }) => dataSources.api.organization.getAllOrganizations();
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
    return { success: !!deleteOrganizationResults };
};
const Organization = {
    locations: async ({ id }, _, { dataSources }) => dataSources.api.location.getAllLocationsByOrgId({ id }),
    events: async ({ id }, _, { dataSources }) => dataSources.api.event.getAllEventsByOrgId({ id })
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
