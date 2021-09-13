const { gql } = require("apollo-server");

const typeDefs = gql`

  # https://stackoverflow.com/questions/49693928/date-and-json-in-type-definition-for-graphql
  scalar Date

  # this is not working at the moment
  union DataObject = Organization | Location | Event | ErrorObject

  """Response from Read Call that can be a Organization, Location, Event, or ErrorObject and will display success status"""
  type Response {
    success: Boolean!
    results: DataObject
  }

  """An organization"""
  type Organization {
    id: ID!
    name: String!
    createdAt: Date!
    updatedAt: Date!
    """List of an organization's locations"""
    locations: [Location]
    """List of an organization's events"""
    events: [Event]
  }

  """An organization's location"""
  type Location {
    id: ID!
    name: String!
    address: String!
    latitude: String!
    longitude: String!
    createdAt: Date!
    updatedAt: Date!
    organizationId: ID!
    """The organization that this location belongs to"""
    organization: Organization!
  }
  
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

  """An Object that contains an error message"""
  type ErrorObject {
    message: String!
  }

  type Query {
    """Gets all organizations"""
    allOrganizations: [Organization]
    """Gets all locations"""
    allLocations: [Location]
    """Gets all events"""
    allEvents: [Event]
    organization("An organization id" id: ID!): Organization
    location("A location id" id: ID!): Location
    event("An event id" id: ID!): Event
    organizations("A list of organization ids" ids: [ID!]): [Organization]
    locations("A list of location ids" ids: [ID!]): [Location]
    events("A list of event ids" ids: [ID!]): [Event]
  }

  type Mutation {
    createOrganization("A new organization name"name: String!): Response!
    createLocation(
      "A location name"
      name: String!
      "A location address"
      address: String!
      "An organization id"
      organizationId: ID!
    ): Response!
    createEvent(
      "An event name"
      name: String!
      "A date and time value (must be json string or milliseconds)"
      dateAndTime: Date!
      "An event description"
      description: String!
      "An organization id"
      organizationId: ID!
    ): Response!
    updateOrganization(
      "Organization id to update" 
      id: ID!, 
      "A new Organization name" 
      name: String!): Response!
    updateLocation(
      "Organization id to update" 
      id: ID!, 
      "A new Location name" 
      name: String,  
      "A new address"
      address: String): Response!
    updateEvent(
      "Organization id to update"
      id: ID!, 
      "A new Event name" 
      name: String, 
      "A new date and time value (must be json string or milliseconds)"
      dateAndTime: Date, 
      "A new description"
      description: String): Response!
    deleteOrganization("Organization id to delete"id: ID!): Response! 
    deleteLocation("Organization id to delete"id: ID!): Response!
    deleteEvent("Organization id to delete"id: ID!): Response!
  }

`;
module.exports = typeDefs;
