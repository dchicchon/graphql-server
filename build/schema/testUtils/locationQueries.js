"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_LOCATION = exports.UPDATE_LOCATION = exports.GET_ALL_LOCATIONS = exports.GET_LOCATIONS = exports.GET_LOCATION = exports.CREATE_LOCATION = void 0;
const apollo_server_1 = require("apollo-server");
exports.CREATE_LOCATION = (0, apollo_server_1.gql) `
  mutation CreateLocation(
      $name: String!, 
      $address: String!, 
      $organizationId: ID!) {
          createLocation(name: $name, address: $address, organizationId: $organizationId) {
              id
              name
              address
              latitude
              longitude
              organizationId 
              # createdAt
              # updatedAt
          }
  }
`;
exports.GET_LOCATION = (0, apollo_server_1.gql) `
  query GetLocation($id: ID!) {
      location(id: $id) {
          id
          name
          address
          latitude
          longitude
          createdAt
          updatedAt
          organizationId
      }
  }
`;
exports.GET_LOCATIONS = (0, apollo_server_1.gql) `
  query GetLocations($ids: [ID!]) {
      locations(ids: $ids) {
          id
          name
          address
          latitude
          longitude
          createdAt
          updatedAt
          organizationId
      }
  }
`;
exports.GET_ALL_LOCATIONS = (0, apollo_server_1.gql) `
        query GetAllLocations {
            allLocations {
                id
                name
                address
                latitude
                longitude
                createdAt
                updatedAt
                organizationId
                # organization
            }
        }
    `;
exports.UPDATE_LOCATION = (0, apollo_server_1.gql) `
  mutation UpdateLocation($id: ID!, $name: String, $address: String) {
    updateLocation(id: $id, name: $name, address: $address) {
        name
        address
        organizationId
    }
  }
`;
exports.DELETE_LOCATION = (0, apollo_server_1.gql) `
  mutation DeleteLocation($id: ID!) {
    deleteLocation(id: $id) {
      success
    }
  }
`;
