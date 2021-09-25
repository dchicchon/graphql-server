"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_EVENT = exports.UPDATE_EVENT = exports.GET_ALL_EVENTS = exports.GET_EVENTS = exports.GET_EVENT = exports.CREATE_EVENT = void 0;
const apollo_server_1 = require("apollo-server");
exports.CREATE_EVENT = (0, apollo_server_1.gql) `
  mutation CreateEvent(
      $name: String!, 
      $dateAndTime: Date! ,
      $description: String! ,
      $organizationId: ID!) {
          createEvent(name: $name, dateAndTime: $dateAndTime, description: $description, organizationId: $organizationId) {
              id
              name
              description
              organizationId
              dateAndTime
              # createdAt
              # updatedAt
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
exports.UPDATE_EVENT = (0, apollo_server_1.gql) `
  mutation UpdateEvent(
      $id: ID!
      $name: String, 
      $dateAndTime: Date ,
      $description: String) {
          updateEvent(id: $id, name: $name, dateAndTime: $dateAndTime, description: $description) {
            #   id
              name
              description
              organizationId
              dateAndTime
              # createdAt
              # updatedAt
          }

  }
`;
exports.DELETE_EVENT = (0, apollo_server_1.gql) `
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      success
    }
  }
`;
