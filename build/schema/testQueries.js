"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_ORGANIZATION = exports.UPDATE_ORGANIZATION = exports.GET_ALL_EVENTS = exports.GET_ALL_LOCATIONS = exports.GET_ALL_ORGANIZATIONS = exports.GET_EVENTS = exports.GET_LOCATIONS = exports.GET_ORGANIZATIONS = exports.GET_EVENT = exports.GET_LOCATION = exports.GET_ORGANIZATION = exports.CREATE_EVENT = exports.CREATE_LOCATION = exports.CREATE_ORGANIZATION = void 0;
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
exports.CREATE_LOCATION = (0, apollo_server_1.gql) `
  mutation CreateLocation(
      $name: String!, 
      $address: String!, 
      $organizationId: ID!) {
          createLocation(name: $name, address: $address, organizationId: $organizationId) {
              id
              # name
              # address
              # latitude
              # longitude
              # createdAt
              # updatedAt
              # organizationId
          }
  }
`;
exports.CREATE_EVENT = (0, apollo_server_1.gql) `
  mutation CreateEvent(
      $name: String!, 
      $dateAndTime: Date! ,
      $description: String! ,
      $organizationId: ID!) {
          createEvent(name: $name, dateAndTime: $dateAndTime, description: $description, organizationId: $organizationId) {
              id
              # name
              # dateAndTime
              # description
              # createdAt
              # updatedAt
              # organizationId
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
              # locations
              # events
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
exports.GET_EVENT = (0, apollo_server_1.gql) `
  query GetEvent($id: ID!) {
      event(id: $id) {
          id
          name
          dateAndTime
          createdAt
          updatedAt
          organizationId
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
          # locations
          # events
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
exports.GET_EVENTS = (0, apollo_server_1.gql) `
            query GetEvents($ids: [ID!]) {
                events(ids: $ids) {
                    id
                    name
                    dateAndTime
                    createdAt
                    updatedAt
                    organizationId
                }
            }
`;
exports.GET_ALL_ORGANIZATIONS = (0, apollo_server_1.gql) `
  query GetOrganizations {
      allOrganizations {
          id
          name
          createdAt
          updatedAt
          # locations
          # events
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
exports.GET_ALL_EVENTS = (0, apollo_server_1.gql) `
            query GetAllEvents {
                allEvents {
                    id
                    name
                    dateAndTime
                    createdAt
                    updatedAt
                    organizationId
                    # organization
                }
            }
        `;
exports.UPDATE_ORGANIZATION = (0, apollo_server_1.gql) `
  query UpdateOrganization($id: ID!, $name: String) {
      updateOrganization(id: $id, name: $name) {
          
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
