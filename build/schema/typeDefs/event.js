"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
exports.typeDefs = (0, apollo_server_1.gql) `
  # https://stackoverflow.com/questions/49693928/date-and-json-in-type-definition-for-graphql
  scalar Date
  
  """An organization's event"""
  type Event {
    id: ID!
    name: String!
    dateAndTime: Date!
    description: String!
    createdAt: Date!
    updatedAt: Date!
    organizationId: ID!
    """The organization that this event belongs to"""
    organization: Organization!
  }
  type Query {
    """Gets all events"""
    allEvents: [Event]
    """Gets an event"""
    event("An event id" id: ID!): Event
    """Gets a list of events"""
    events("A list of event ids" ids: [ID!]): [Event]
  }

  type Mutation {
    """Creates an event"""
    createEvent(
      "An event name"
      name: String!
      "A date and time value (must be json string or milliseconds)"
      dateAndTime: Date!
      "An event description"
      description: String!
      "An organization id"
      organizationId: ID!
    ): Event!
    """Updates an event"""
    updateEvent(
      "Organization id to update"
      id: ID!, 
      "A new Event name" 
      name: String, 
      "A new date and time value (must be json string or milliseconds)"
      dateAndTime: Date, 
      "A new description"
      description: String): Event!
    """Deletes an event"""
    deleteEvent("Organization id to delete"id: ID!): deleteEventResponse!
  }

  type deleteEventResponse {
    success: Boolean
  }
`;
