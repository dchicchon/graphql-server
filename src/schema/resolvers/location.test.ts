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

// Make multiple tests for resolvers probably
// Resolvers Test
describe('resolvers', () => {
    let server: ApolloServer;
    let organizationId: any;
    let locationId: any;
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

        // create some data here
        const createOrganizationResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Twitter" }
        })
        organizationId = createOrganizationResult.data?.createOrganization.id
        const createLocationResult = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Twitter SF Headquarters",
                address: "1355 Market St #900, San Francisco, CA 94103",
                organizationId: organizationId,
            }
        })
        locationId = createLocationResult.data?.createLocation.id
    })

    afterAll(async () => {
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })
        for (const org of findResult.data?.allOrganizations) {
            const organizationId = org.id

            const deleteResult = await server.executeOperation({
                query: Queries.DELETE_ORGANIZATION,
                variables: { id: organizationId }
            })
        }
    })

    it("Creates a Location", async () => {
        expect.assertions(2)

        const createResult = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Twitter NYC Headquarters",
                address: "245 W 17th St, New York, NY 11238",
                organizationId,
            }
        })

        expect(createResult.errors).toBe(undefined)
        expect(createResult.data?.createLocation.name).toBe("Twitter NYC Headquarters")
    })

    it('Fetch Location By Id', async () => {
        expect.assertions(2)

        const findResult = await server.executeOperation({
            query: Queries.GET_LOCATION,
            variables: { id: locationId }
        })

        expect(findResult.errors).toBe(undefined)
        expect(findResult.data?.location.name).toBe("Twitter SF Headquarters")

    })

    it('Fetch Locations By Ids', async () => {
        expect.assertions(2)

        const findAllResults = await server.executeOperation({
            query: Queries.GET_ALL_LOCATIONS
        })

        const locationIds = findAllResults.data?.allLocations.map((location: any) => location.id)

        const results = await server.executeOperation({
            query: Queries.GET_LOCATIONS,
            variables: { ids: locationIds }
        })

        expect(results.errors).toBe(undefined)
        expect(results.data?.locations).toHaveLength(2)
    })

    it("Fetch All Locations", async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: Queries.GET_ALL_LOCATIONS
        })

        expect(findResults.errors).toBe(undefined)
        expect(findResults.data?.allLocations).toHaveLength(2)

    })

    it("Updates a Location", async () => {

        expect.assertions(2)
        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_LOCATION,
            variables: {
                name: "Twitter Resort",
                id: locationId,
            }
        })

        expect(updateResult.errors).toBe(undefined)
        expect(updateResult.data?.updateLocation.name).toBe("Twitter Resort")
    })

    it("Creates and Deletes a Location", async () => {
        expect.assertions(2)
        const expectedResult = {
            success: true
        }
        // First find the first organization that shows up and use its id

        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_LOCATION,
            variables: { id: locationId }
        })

        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteLocation).toEqual(expectedResult)
    })

})