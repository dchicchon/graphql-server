import { ApolloServer } from 'apollo-server'
import { createTestServer } from '../../testUtils/createTestServer'
import * as LocationQueries from '../../testUtils/locationQueries'
import * as OrganizationQueries from '../../testUtils/organizationQueries'


// Make multiple tests for resolvers probably
// Resolvers Test
describe('resolvers', () => {
    let server: ApolloServer;
    let organizationId: any;
    let locationId: any;
    beforeAll(async () => {
        server = await createTestServer();

        // create some data here
        const createOrganizationResult = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: { name: "Twitter" }
        })
        organizationId = createOrganizationResult.data?.createOrganization.id
        const createLocationResult = await server.executeOperation({
            query: LocationQueries.CREATE_LOCATION,
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
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })
        for (const org of findResult.data?.allOrganizations) {
            const organizationId = org.id

            const deleteResult = await server.executeOperation({
                query: OrganizationQueries.DELETE_ORGANIZATION,
                variables: { id: organizationId }
            })
        }
    })

    it("Creates a Location", async () => {
        expect.assertions(2)

        const createResult = await server.executeOperation({
            query: LocationQueries.CREATE_LOCATION,
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
            query: LocationQueries.GET_LOCATION,
            variables: { id: locationId }
        })

        expect(findResult.errors).toBe(undefined)
        expect(findResult.data?.location.name).toBe("Twitter SF Headquarters")

    })

    it('Fetch Locations By Ids', async () => {
        expect.assertions(2)

        const findAllResults = await server.executeOperation({
            query: LocationQueries.GET_ALL_LOCATIONS
        })

        const locationIds = findAllResults.data?.allLocations.map((location: any) => location.id)

        const results = await server.executeOperation({
            query: LocationQueries.GET_LOCATIONS,
            variables: { ids: locationIds }
        })

        expect(results.errors).toBe(undefined)
        expect(results.data?.locations).toHaveLength(2)
    })

    it("Fetch All Locations", async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: LocationQueries.GET_ALL_LOCATIONS
        })

        expect(findResults.errors).toBe(undefined)
        expect(findResults.data?.allLocations).toHaveLength(2)

    })

    it("Updates a Location's Name", async () => {
        expect.assertions(2)
        const updateResult = await server.executeOperation({
            query: LocationQueries.UPDATE_LOCATION,
            variables: {
                name: "Twitter Resort",
                id: locationId,
            }
        })

        expect(updateResult.errors).toBe(undefined)
        expect(updateResult.data?.updateLocation.name).toBe("Twitter Resort")
    })

    it("Update's a Location's address", async () => {
        expect.assertions(2)
        const updateResult = await server.executeOperation({
            query: LocationQueries.UPDATE_LOCATION,
            variables: {
                address: "Lanai Ave, Lanai City, HI 96763",
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
            query: LocationQueries.DELETE_LOCATION,
            variables: { id: locationId }
        })

        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteLocation).toEqual(expectedResult)
    })
})