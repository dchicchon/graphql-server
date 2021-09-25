import { gql } from 'apollo-server'

// CREATE
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
export const CREATE_EVENT = gql`
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

// READ 
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
export const GET_EVENT = gql`
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

export const GET_EVENTS = gql`
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
export const GET_ALL_EVENTS = gql`
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

// UPDATE
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

export const UPDATE_LOCATION = gql`
  mutation UpdateLocation($id: ID!, $name: String, $address: String) {
    updateLocation(id: $id, name: $name, address: $address) {
        name
        address
        organizationId
    }
  }
`

export const UPDATE_EVENT = gql`
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



// DELETE
export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
      deleteOrganization(id: $id) {
          success
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

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      success
    }
  }
`
