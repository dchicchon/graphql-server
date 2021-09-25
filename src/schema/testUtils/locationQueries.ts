
import { gql } from 'apollo-server'

export const CREATE_LOCATION = gql`
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
export const GET_LOCATION = gql`
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
export const GET_LOCATIONS = gql`
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
export const GET_ALL_LOCATIONS = gql`
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
export const UPDATE_LOCATION = gql`
  mutation UpdateLocation($id: ID!, $name: String, $address: String) {
    updateLocation(id: $id, name: $name, address: $address) {
        name
        address
        organizationId
    }
  }
`
export const DELETE_LOCATION = gql`
  mutation DeleteLocation($id: ID!) {
    deleteLocation(id: $id) {
      success
    }
  }
`