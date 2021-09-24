import { gql } from 'apollo-server'
export const typeDefs = gql`
  # https://stackoverflow.com/questions/49693928/date-and-json-in-type-definition-for-graphql
  scalar Date
  
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
  
  type Query {
    """Gets all organizations"""
    allOrganizations: [Organization]
    """Gets an organization"""
    organization("An organization id" id: ID!): Organization
    """Gets a list of organizations"""
    organizations("A list of organization ids" ids: [ID!]): [Organization]
  }

  type Mutation {
    """Creates an organization"""
    createOrganization("A new organization name" name: String!): Organization!
    """Updates an organization"""
    updateOrganization(
      "Organization id to update" 
      id: ID!, 
      "A new Organization name" 
      name: String!): Organization!
    """Deletes an organization"""
    deleteOrganization("Organization id to delete"id: ID!): deleteOrganizationResponse
  }

  type deleteOrganizationResponse {
    success: Boolean
  }

  input NewOrganization {
    name: String!
  }

  type NewOrganizationResponse {
    organization: Organization
  }

`;