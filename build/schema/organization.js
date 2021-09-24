"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = exports.deleteOrganization = exports.updateOrganization = exports.createOrganization = exports.allOrganizations = exports.organizations = exports.organization = void 0;
const organization = async (_, { id }, { dataSources }) => dataSources.api.getOrganization({ id });
exports.organization = organization;
const organizations = async (_, { ids }, { dataSources }) => dataSources.api.getOrganizations({ ids });
exports.organizations = organizations;
const allOrganizations = async (_, __, { dataSources }) => dataSources.api.getAllOrganizations();
exports.allOrganizations = allOrganizations;
const createOrganization = async (_, { name }, { dataSources }) => {
    const results = await dataSources.api.createOrganization({ name });
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
exports.createOrganization = createOrganization;
const updateOrganization = async (_, { id, name }, { dataSources }) => {
    const results = await dataSources.api.updateOrganization({ id, name });
    return {
        success: results && results,
    };
};
exports.updateOrganization = updateOrganization;
const deleteOrganization = async (_, { id }, { dataSources }) => {
    const results = await dataSources.api.deleteOrganization({ id });
    return {
        success: results && results
    };
};
exports.deleteOrganization = deleteOrganization;
exports.Organization = {
    locations: async ({ id }, _, { dataSources }) => dataSources.api.getAllLocationsByOrgId({ id }),
    events: async ({ id }, _, { dataSources }) => dataSources.api.getAllEventsByOrgId({ id })
};
