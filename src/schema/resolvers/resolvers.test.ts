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

describe("Testing Jest", () => {
    it("Runs a test", async () => {
        const item = 1;
        expect(item).toBe(1)
    })
})

// Make multiple tests for resolvers probably
// Resolvers Test
describe('All Resolvers', () => {
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
        // Delete all remaining organizations
        const result = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })
        for (const org of result.data?.allOrganizations) {
            await server.executeOperation({
                query: Queries.DELETE_ORGANIZATION,
                variables: {
                    id: org.id
                }
            })
        }
        const result2 = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })
        // console.log(result2.data?.allOrganizations) // this should be 0

    })

    // TESTS: CREATE
    it("Create an Organization", async () => {
        expect.assertions(2)
        const result = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Polus" }
        })

        expect(result.errors).toBe(undefined)
        expect(result.data?.createOrganization.name).toBe("Polus")
    })

    it("Creates a Location", async () => {
        expect.assertions(3)

        // Find the first result and add this location to it
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })

        const organizationId = findResult.data?.allOrganizations[0].id

        // const expectedResult = {
        //     name: "Polus Headquarters",
        //     address: "205 W 109th Street, New York, New York 100025",
        //     latitude: "40.802731",
        //     longitude: "-73.96481059999999",
        //     organizationId,
        // }

        // First find the first organization that shows up and use its id

        const createResult = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Polus Headquarters",
                address: "205 W 109th Street, New York, New York 100025",
                organizationId: organizationId,
            }
        })

        expect(findResult.errors).toBe(undefined)
        // expect(findResult.data?.allOrganizations).toHaveLength(1)
        expect(createResult.errors).toBe(undefined)
        expect(createResult.data?.createLocation.name).toBe("Polus Headquarters")
    })

    it("Creates an Event", async () => {
        expect.assertions(2)

        // Find the first result and add this location to it
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })

        const organizationId = findResult.data?.allOrganizations[0].id


        // const expectedResult = {
        //     name: "Party!",
        //     description: "A gathering of friends",
        //     dateAndTime: new Date('10/12/2021').getTime(),
        //     organizationId
        // }

        const eventResult = await server.executeOperation({
            query: Queries.CREATE_EVENT,
            variables: {
                name: "Party!",
                dateAndTime: new Date('10/12/2021'),
                description: "A gathering of friends",
                organizationId: organizationId,
            }
        })

        expect(eventResult.errors).toBe(undefined)
        expect(eventResult.data?.createEvent.name).toBe("Party!")

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


    it("Fetch All Locations", async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: Queries.GET_ALL_LOCATIONS
        })

        expect(findResults.errors).toBe(undefined)
        expect(findResults.data?.allLocations).toHaveLength(1)

    })
    it("Fetch All Events", async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: Queries.GET_ALL_EVENTS
        })

        expect(findResults.errors).toBe(undefined)
        expect(findResults.data?.allEvents).toHaveLength(1)

    })

    // TESTS: UPDATE
    it("Updates an Organization", async () => {
        expect.assertions(4)
        // console.log("Updating an Organization")
        // First find the first item in our database and update it
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS,
        })

        const organizationId = findResult.data?.allOrganizations[0].id

        // console.log(findResult.data?.allOrganizations)

        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_ORGANIZATION,
            variables: {
                id: organizationId,
                name: "Pola"
            }
        })

        const revertResult = await server.executeOperation({
            query: Queries.UPDATE_ORGANIZATION,
            variables: {
                id: organizationId,
                name: "Polus"
            }
        })

        // console.log(updateResult)

        expect(updateResult.errors).toBe(undefined)
        expect(findResult.data?.allOrganizations[0].name).toBe("Polus")
        expect(updateResult.data?.updateOrganization.name).toBe("Pola")
        expect(revertResult.data?.updateOrganization.name).toBe("Polus")
    })

    it("Updates a Location", async () => {

        expect.assertions(4)
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })

        const locationId = findResult.data?.allOrganizations[0].locations[0].id
        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_LOCATION,
            variables: {
                name: "Polus Resort",
                id: locationId,
            }
        })


        expect(findResult.errors).toBe(undefined)
        expect(findResult.data?.allOrganizations[0].locations[0].name).toBe("Polus Headquarters")
        expect(updateResult.errors).toBe(undefined)
        expect(updateResult.data?.updateLocation.name).toBe("Polus Resort")
    })

    it("Updates an Event", async () => {
        expect.assertions(4)
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })

        const eventId = findResult.data?.allOrganizations[0].events[0].id

        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_EVENT,
            variables: {
                id: eventId,
                name: "Birthday",
                dateAndTime: new Date('12/18/2021'),
                description: "It's my birthday!",
            }
        })


        expect(findResult.errors).toBe(undefined)
        expect(findResult.data?.allOrganizations[0].events[0].name).toBe("Party!")
        expect(updateResult.errors).toBe(undefined)
        expect(updateResult.data?.updateEvent.name).toBe("Birthday")
    })


    // TESTS: DELETE
    it("Create and Deletes an organization", async () => {
        expect.assertions(4)

        const createResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Google" }
        })

        const expectedResult = {
            success: true
        }

        const organizationId = createResult.data?.createOrganization.id

        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_ORGANIZATION,
            variables: { id: organizationId }
        })

        expect(createResult.errors).toBe(undefined)
        expect(createResult.data?.createOrganization.name).toBe("Google")
        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteOrganization).toEqual(expectedResult)
    })

    it("Creates and Deletes a Location", async () => {
        expect.assertions(4)
        const expectedResult = {
            success: true
        }
        // Find the first result and add this location to it
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })

        const organizationId = findResult.data?.allOrganizations[0].id

        // First find the first organization that shows up and use its id

        const createResult = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Company Island",
                address: "23 Happy Valley Rd, Pembroke, Bermuda",
                organizationId: organizationId,
            }
        })

        const locationId = createResult.data?.createLocation.id

        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_LOCATION,
            variables: { id: locationId }
        })

        expect(findResult.errors).toBe(undefined)
        expect(createResult.errors).toBe(undefined)
        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteLocation).toEqual(expectedResult)
    })

    it("Creates and Deletes an Event", async () => {

        const expectedResult = {
            success: true
        }
        // Find the first result and add this location to it
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })

        const organizationId = findResult.data?.allOrganizations[0].id

        // First find the first organization that shows up and use its id

        const createResult = await server.executeOperation({
            query: Queries.CREATE_EVENT,
            variables: {
                name: "Stockholder Meeting",
                dateAndTime: new Date('11/11/2021'),
                description: "Gathering all of the stockholders in order to talk about the company's future",
                organizationId: organizationId,
            }
        })

        const eventId = createResult.data?.createEvent.id

        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_EVENT,
            variables: { id: eventId }
        })

        expect(findResult.errors).toBe(undefined)
        expect(createResult.errors).toBe(undefined)
        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteEvent).toEqual(expectedResult)
    })



})