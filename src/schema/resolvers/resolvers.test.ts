/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloServer } from 'apollo-server'
import * as Queries from '../testQueries'
import { resolvers as organizationResolvers } from './organization'
import { resolvers as locationResolvers } from './location'
import { resolvers as eventResolvers } from './event'
import { resolvers as utilResolvers } from './util'
import { typeDefs as organizationDefs } from '../typeDefs/organization'
import { typeDefs as locationDefs } from '../typeDefs/location'
import { typeDefs as eventDefs } from '../typeDefs/event'
import API from '../../datasources/api'
import createStore from '../../datasources/store'
import Organization from '../../datasources/api/organization'
import Location from '../../datasources/api/location'
import Event from '../../datasources/api/event'
import { config } from 'dotenv'


// Resolvers Test
describe('resolvers', () => {
    let server: ApolloServer;


    beforeAll(async () => {
        config()
        const store = createStore()
        const organizationAPI = new Organization(store.organization)
        const locationAPI = new Location(store.location)
        const eventAPI = new Event(store.event)
        const dataSources = () => ({
            api: new API(organizationAPI, locationAPI, eventAPI)
        })
        server = new ApolloServer({
            typeDefs: [organizationDefs, locationDefs, eventDefs],
            resolvers: [organizationResolvers, locationResolvers, eventResolvers, utilResolvers],
            dataSources
        })
        // maybe inject some data into the database beforehand and then delete afterwards
    })

    afterAll(async () => {
        // const result = await server.executeOperation({
        //     query: Queries.GET_ALL_ORGANIZATIONS
        // })
        // for (const organization of result.data?.allOrganizations) {
        //     await server.executeOperation({
        //         query: Queries.DELETE_ORGANIZATION,
        //         variables: {
        //             id: organization.id
        //         }
        //     })
        // }
        // const result2 = await server.executeOperation({
        //     query: Queries.GET_ALL_ORGANIZATIONS
        // })
        // console.log(result2.data?.allOrganizations) // this should be 0

    })

    // TESTS: CREATE
    it("Create an Organization", async () => {
        expect.assertions(1)
        const organizationResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Polus" }
        })

        expect(organizationResult.errors).toBe(undefined)
    })

    it("Creates a Location", async () => {
        expect.assertions(1)

        const locationResult = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Polus Headquarters",
                address: "205 W 109th Street, New York, New York 100025",
                organizationId: 1,
            }
        })

        expect(locationResult.errors).toBe(undefined)

    })

    it("Creates an Event", async () => {
        expect.assertions(1)

        const eventResult = await server.executeOperation({
            query: Queries.CREATE_EVENT,
            variables: {
                name: "Party!",
                dateAndTime: new Date(),
                description: "A gathering of friends",
                organizationId: 1
            }
        })

        expect(eventResult.errors).toBe(undefined)

    })

    // TESTS: READ
    it('Fetch Organization by Id', async () => {
        expect.assertions(1)
        const results = await server.executeOperation({
            query: Queries.GET_ORGANIZATION,
            variables: { id: 1 }
        })

        expect(results.errors).toBe(undefined)
        // expect(results.data?.organization)
        // console.log(results.data?.organization)
    })

    it('Fetch Location By Id', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: Queries.GET_LOCATION,
            variables: { id: 1 }
        })

        // console.log("Find Location Test")
        // console.log(results)

        expect(results.errors).toBe(undefined)
    })

    it('Fetch Event By Id', async () => {

        expect.assertions(1)

        const results = await server.executeOperation({
            query: Queries.GET_EVENT,
            variables: { id: 1 }
        })

        // console.log("Find Event Test")
        // console.log(results)

        expect(results.errors).toBe(undefined)
    })

    it('Fetch Organizations by Ids', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: Queries.GET_ORGANIZATIONS,
            variables: { ids: [1] }
        })

        expect(results.errors).toBe(undefined)
    })

    it('Fetch Locations By Ids', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: Queries.GET_LOCATIONS,
            variables: { ids: [1] }
        })

        expect(results.errors).toBe(undefined)
    })

    it('Fetch Events By Ids', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: Queries.GET_EVENTS,
            variables: { ids: [1] }
        })

        expect(results.errors).toBe(undefined)
    })

    it('Fetch All Organizations', async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })


        expect(results.errors).toBe(undefined)


    })

    it("Fetch All Locations", async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: Queries.GET_ALL_LOCATIONS
        })

        expect(results.errors).toBe(undefined)

    })
    it("Fetch All Events", async () => {
        expect.assertions(1)

        const results = await server.executeOperation({
            query: Queries.GET_ALL_EVENTS
        })

        expect(results.errors).toBe(undefined)

    })

    it("Updates an Organization", async () => {

    })

    // it("Deletes 1st Organization along with all it's Locations and Events", async () => {
    //     expect.assertions(1)

    //     const result = 
    //     expect(result.data?.deleteOrganization.success).toBe(true)
    // })


})