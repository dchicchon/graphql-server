import { gql } from 'apollo-server'

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!) {
      createOrganization(name: $name) {
          id
          name
          createdAt
          updatedAt
      }
  }
`;
export const GET_ORGANIZATION = gql`
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
export const GET_ORGANIZATIONS = gql`
  query GetOrganization($ids: [ID!]) {
      organizations(ids: $ids) {
          id
          name
          createdAt
          updatedAt
      }
  }
`;
export const GET_ALL_ORGANIZATIONS = gql`
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
export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $name: String!) {
      updateOrganization(id: $id, name: $name) {
          id
          name
        #   updatedAt
        #   createdAt
      }
  }
`
export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
      deleteOrganization(id: $id) {
          success
      }
  }
`