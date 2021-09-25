"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_ORGANIZATION = exports.UPDATE_ORGANIZATION = exports.GET_ALL_ORGANIZATIONS = exports.GET_ORGANIZATIONS = exports.GET_ORGANIZATION = exports.CREATE_ORGANIZATION = void 0;
const apollo_server_1 = require("apollo-server");
exports.CREATE_ORGANIZATION = (0, apollo_server_1.gql) `
  mutation CreateOrganization($name: String!) {
      createOrganization(name: $name) {
          id
          name
          createdAt
          updatedAt
      }
  }
`;
exports.GET_ORGANIZATION = (0, apollo_server_1.gql) `
      query GetOrganization($id: ID!) {
          organization(id: $id) {
              id
              name
              createdAt
              updatedAt
          }
      }
`;
exports.GET_ORGANIZATIONS = (0, apollo_server_1.gql) `
  query GetOrganization($ids: [ID!]) {
      organizations(ids: $ids) {
          id
          name
          createdAt
          updatedAt
      }
  }
`;
exports.GET_ALL_ORGANIZATIONS = (0, apollo_server_1.gql) `
  query GetAllOrganizations {
      allOrganizations {
          id
          name
          createdAt
          updatedAt
          locations {
            id
            name
          }
          events {
            id
            name
          }
      }
  }
`;
exports.UPDATE_ORGANIZATION = (0, apollo_server_1.gql) `
  mutation UpdateOrganization($id: ID!, $name: String!) {
      updateOrganization(id: $id, name: $name) {
          id
          name
        #   updatedAt
        #   createdAt
      }
  }
`;
exports.DELETE_ORGANIZATION = (0, apollo_server_1.gql) `
  mutation DeleteOrganization($id: ID!) {
      deleteOrganization(id: $id) {
          success
      }
  }
`;
