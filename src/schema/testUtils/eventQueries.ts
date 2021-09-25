import { gql } from 'apollo-server'
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

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      success
    }
  }
`