/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'apollo-server'
import { Organization, Store } from '../interfaces/Types'
import { ApolloServer } from 'apollo-server'
import resolvers from '../schema/resolvers'
import typeDefs from '../schema/typeDefs'
import organizationSample from '../testUtils/organizationSample'
import API from '../datasources/api'
import createStore from '../datasources/store'

describe('resolvers', () => {
    let server: ApolloServer;
    beforeAll(async () => {
        const store = createStore()
        const dataSources = () => ({
            api: new API(store)
        })
        server = new ApolloServer({ typeDefs, resolvers, dataSources })
        // maybe inject some data into the database beforehand and then delete afterwards
    })

    afterAll(async () => {

    })
    // Fetch by Id
    it('fetch one organization by id', async () => {

        // start using executeOperation to test my server
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

        const results = await server.executeOperation({
            query: GET_ORGANIZATION,
            variables: { id: 1 }
        })

        expect(results.errors).toBe(undefined)
    })

    it('fetch one location by id', async () => {
        // start using executeOperation to test my server
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

        const results = await server.executeOperation({
            query: GET_LOCATION,
            variables: { id: 1 }
        })

        expect(results.errors).toBe(undefined)
    })

    it('fetch one event by id', async () => {

        // start using executeOperation to test my server
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

        const results = await server.executeOperation({
            query: GET_EVENT,
            variables: { id: 1 }
        })


        expect(results.errors).toBe(undefined)
    })

    // Fetch All By Id
    it('fetch multiple organizations by ids', async () => {

        // start using executeOperation to test my server
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

        const results = await server.executeOperation({
            query: GET_ORGANIZATIONS,
            variables: { ids: [1] }
        })

        expect(results.errors).toBe(undefined)
    })

    it('fetch multiple locations by id', async () => {

        // start using executeOperation to test my server
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

        const results = await server.executeOperation({
            query: GET_LOCATIONS,
            variables: { ids: [1] }
        })

        expect(results.errors).toBe(undefined)
    })

    it('fetch multiple events by id', async () => {

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

        const results = await server.executeOperation({
            query: GET_EVENTS,
            variables: { ids: [1] }
        })


        expect(results.errors).toBe(undefined)
    })

    // Fetch All
    it('fetches all organizations', async () => {

        // start using executeOperation to test my server
        const GET_ORGANIZATIONS = gql`
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

        const results = await server.executeOperation({
            query: GET_ORGANIZATIONS
        })


        expect(results.errors).toBe(undefined)


    })

    it("fetches all locations", async () => {

        // start using executeOperation to test my server
        const GET_LOCATIONS = gql`
            query GetLocations {
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

        const results = await server.executeOperation({
            query: GET_LOCATIONS
        })


        expect(results.errors).toBe(undefined)

    })
    it("fetches all events", async () => {
        // start using executeOperation to test my server
        const GET_EVENTS = gql`
            query GetEvents {
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

        const results = await server.executeOperation({
            query: GET_EVENTS
        })


        expect(results.errors).toBe(undefined)

    })

    // Work on this later

    // it('creates an organization', async () => {
    //     const store: Store = createStore();
    //     const dataSources = () => ({
    //         api: new API(store)
    //     })

    //     const server = new ApolloServer({ typeDefs, resolvers, dataSources })

    //     const newOrganization = {
    //         name: 'Econify'
    //     }

    //     const CREATE_ORGANIZATION = gql`
    //         mutation CreateOrganization($newOrganization: NewOrganization! ) {
    //             createOrganization(newOrganization: $newOrganization) {
    //                 organizations {
    //                     id
    //                     name
    //                 }
    //             }
    //         }

    //     `;
    //     const results = await server.executeOperation({
    //         query: CREATE_ORGANIZATION,
    //         variables: newOrganization
    //     })

    //     expect(results.errors).toBe(undefined)

    // })
})