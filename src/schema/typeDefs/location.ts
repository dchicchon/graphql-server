import { gql } from 'apollo-server'
export const typeDefs = gql`
  # https://stackoverflow.com/questions/49693928/date-and-json-in-type-definition-for-graphql
  scalar Date
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

  type Query {
    """Gets all locations"""
    allLocations: [Location]
    """Gets a location"""
    location("A location id" id: ID!): Location
    """Gets a list of locations"""
    locations("A list of location ids" ids: [ID!]): [Location]
  }

  type Mutation {
    """Creates a location"""
    createLocation(
      "A location name"
      name: String!
      "A location address"
      address: String!
      "An organization id"
      organizationId: ID!
    ): Location!
    """Updates a location"""
    updateLocation(
      "Organization id to update" 
      id: ID!, 
      "A new Location name" 
      name: String,  
      "A new address"
      address: String): Response!
    """Deletes a location"""
    deleteLocation("Organization id to delete"id: ID!): Response!
  }
`;