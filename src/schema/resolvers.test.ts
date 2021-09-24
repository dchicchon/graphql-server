/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'apollo-server'
import { Organization, Store } from '../interfaces/Types'
import { ApolloServer } from 'apollo-server'
import resolvers from '../schema/resolvers'
import typeDefs from '../schema/typeDefs'
import organizationSample from '../testUtils/organizationSample'
import API from '../datasources/api'
import createStore from '../datasources/store'
import { organizations } from './organization'


// Resolvers Test
describe('resolvers', () => {
    let server: ApolloServer;


    // CREATE
    const CREATE_ORGANIZATION = gql`
        mutation CreateOrganization($name: String!) {
            createOrganization(name: $name) {
                id
                name
                createdAt
                updatedAt
            }
        }
    `;
    const CREATE_LOCATION = gql`
        mutation CreateLocation($name: String! $address: String! $organizationId: ID!) {
                createLocation(name: $name, address: $address, organizationId: $organizationId) {
                    id
                    # name
                    # address
                    # latitude
                    # longitude
                    # createdAt
                    # updatedAt
                    # organizationId
                }
        }
    `;
    const CREATE_EVENT = gql`
        mutation CreateEvent(
            $name: String! 
            $dateAndTime: Date! 
            $description: String! 
            $organizationId: ID!) {
                createEvent(name: $name, dateAndTime: $dateAndTime, description: $description, organizationId: $organizationId) {
                    id
                    # name
                    # dateAndTime
                    # description
                    # createdAt
                    # updatedAt
                    # organizationId
                }

        }
    `;

    // READ 
    const GET_ORGANIZATION = gql`
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
    const GET_LOCATION = gql`
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
    const GET_EVENT = gql`
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

    const GET_ORGANIZATIONS = gql`
        query GetOrganization($ids: [ID!]) {
            organizations(ids: $ids) {
                id
                name
                createdAt
                updatedAt
                # locations
                # events
            }
        }
    `;

    const GET_LOCATIONS = gql`
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

    // start using executeOperation to test my server
    const GET_EVENTS = gql`
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

    // start using executeOperation to test my server
    const GET_ALL_ORGANIZATIONS = gql`
        query GetOrganizations {
            allOrganizations {
                id
                name
                createdAt
                updatedAt
                # locations
                # events
            }
        }
    `;

    // start using executeOperation to test my server
    const GET_ALL_LOCATIONS = gql`
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
    // start using executeOperation to test my server
    const GET_ALL_EVENTS = gql`
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
    // const UPDATE_ORGANIZATION = gql``

    // const UPDATE_LOCATION = gql``

    // const READ_LOCATION = gql``

    // DELETE
    const DELETE_ORGANIZATION = gql`
        mutation DeleteOrganization($id: ID!) {
            deleteOrganization(id: $id) {
                success
            }
        }
    `

    // const DELETE_LOCATION = gql``

    // const DELETE_EVENT = gql``


    beforeAll(async () => {
        const store = createStore()
        const dataSources = () => ({
            api: new API(store)
        })
        server = new ApolloServer({ typeDefs, resolvers, dataSources })
        // maybe inject some data into the database beforehand and then delete afterwards
        await server.executeOperation({
            query: CREATE_ORGANIZATION,
            variables: { name: "Polus" }
        })
        await server.executeOperation({
            query: CREATE_LOCATION,
            variables: {
                name: "Polus Headquarters",
                address: "205 W 109th Street, New York, New York 100025",
                organizationId: 1,
            }
        })

        await server.executeOperation({
            query: CREATE_EVENT,
            variables: {
                name: "Party!",
                dateAndTime: new Date(),
                description: "A gathering of friends",
                organizationId: 1
            }
        })
    })

    afterAll(async () => {
        const result = await server.executeOperation({
            query: GET_ALL_ORGANIZATIONS
        })
        for (const organization of result.data?.allOrganizations) {
            await server.executeOperation({
                query: DELETE_ORGANIZATION,
                variables: {
                    id: organization.id
                }
            })
        }
        const result2 = await server.executeOperation({
            query: GET_ALL_ORGANIZATIONS
        })
        console.log(result2.data?.allOrganizations) // this should be 0

    })

    // TESTS: CREATE
    it("Create an Organization with a Location and Event then Delete it", async () => {
        expect.assertions(4)
        const organizationResult = await server.executeOperation({
            query: CREATE_ORGANIZATION,
            variables: { name: "Test Organization" }
        })

        const locationResult = await server.executeOperation({
            query: CREATE_LOCATION,
            variables: {
                name: "Test Location",
                address: "8623 Carey Court, Stockton, CA 95212",
                organizationId: 2
            }
        })

        const eventResult = await server.executeOperation({
            query: CREATE_EVENT,
            variables: {
                name: "Test Event",
                description: "This is a test event",
                dateAndTime: new Date(),
                organizationId: 2
            }
        })

        const deleteResult = await server.executeOperation({
            query: DELETE_ORGANIZATION,
            variables: { id: 2 }
        })
        expect(organizationResult.errors).toBe(undefined)
        expect(locationResult.errors).toBe(undefined)
        expect(eventResult.errors).toBe(undefined)
        expect(deleteResult.errors).toBe(undefined)
    })

    // it("Creates a Location", async () => {
    //     expect.assertions(1)



    //     expect(location.errors).toBe(undefined)

    // })

    // it("Creates an Event", async () => {
    //     expect.assertions(1)


    //     expect(event.errors).toBe(undefined)


    // })

    // TESTS: READ
    it('Fetch Organization by Id', async () => {
        expect.assertions(1)
        const results = await server.executeOperation({
            query: GET_ORGANIZATION,
            variables: { id: 1 }
        })

        expect(results.errors).toBe(undefined)
        expect(results.data?.organization)
    })

    it('Fetch Location By Id', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: GET_LOCATION,
            variables: { id: 1 }
        })

        expect(results.errors).toBe(undefined)
    })

    it('Fetch Event By Id', async () => {

        expect.assertions(1)

        const results = await server.executeOperation({
            query: GET_EVENT,
            variables: { id: 1 }
        })

        expect(results.errors).toBe(undefined)
    })

    it('Fetch Organizations by Ids', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: GET_ORGANIZATIONS,
            variables: { ids: [1] }
        })

        expect(results.errors).toBe(undefined)
    })

    it('Fetch Locations By Ids', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: GET_LOCATIONS,
            variables: { ids: [1] }
        })

        expect(results.errors).toBe(undefined)
    })

    it('Fetch Events By Ids', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: GET_EVENTS,
            variables: { ids: [1] }
        })

        expect(results.errors).toBe(undefined)
    })

    it('Fetch All Organizations', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: GET_ALL_ORGANIZATIONS
        })


        expect(results.errors).toBe(undefined)


    })

    it("Fetch All Locations", async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: GET_ALL_LOCATIONS
        })

        expect(results.errors).toBe(undefined)

    })
    it("Fetch All Events", async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: GET_ALL_EVENTS
        })

        expect(results.errors).toBe(undefined)

    })

    // it("Deletes 1st Organization along with all it's Locations and Events", async () => {
    //     expect.assertions(1)

    //     const result = 
    //     expect(result.data?.deleteOrganization.success).toBe(true)
    // })


})