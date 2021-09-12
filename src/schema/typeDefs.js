const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar Date

  # this is not working at the moment
  union DataObject = Organization | Location | Event

  type Organization {
    id: ID!
    name: String!
    createdAt: Date!
    updatedAt: Date!
    locations: [Location]
    events: [Event]
  }

  # Scalar date. Need to add resolver mapper later on
  # https://stackoverflow.com/questions/49693928/date-and-json-in-type-definition-for-graphql
  type Location {
    id: ID!
    name: String!
    address: String!
    latitude: String!
    longitude: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type Event {
    name: String!
    dateAndTime: String!
    description: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type Query {
    allOrganizations: [Organization]
    organization(id: ID!): Organization
    location(id: ID!): Location
    event(id: ID!): Event
    organizations(ids: [ID!]): [Organization]
    locations(ids: [ID!]): [Location]
    events(ids: [ID!]): [Event]
  }

  type Mutation {
    createOrganization(name: String!): Response!
    createLocation(
      name: String!
      address: String!
      latitude: String!
      longitude: String!
      id: ID!
    ): Response!
    createEvent(
      name: String!
      dateAndTime: String!
      description: String!
      id: ID!
    ): Response!
    updateOrganization(id: ID!): Response!
    updateLocation(id: ID!): Response!
    updateEvent(id: ID!): Response!
    deleteOrganization(id: ID!): Response! # if delete organization, I should probably delete locations and events too
    deleteLocation(id: ID!): Response!
    deleteEvent(id: ID!): Response!
  }
  type Response {
    success: Boolean!
    results: DataObject
  }
`;
module.exports = typeDefs;
