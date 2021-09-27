import { ApolloServer } from 'apollo-server'
import { CreateLocationArguments, DeleteLocationArguments, FindLocationArguments, UpdateLocationArguments } from '../../../interfaces/LocationTypes'
import { CreateOrganizationArguments, DeleteOrganizationArguments } from '../../../interfaces/OrganizationTypes'
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

        const createOrganization: CreateOrganizationArguments = { name: "Twitter" }

        const createOrganizationResult = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: createOrganization
        })
        organizationId = createOrganizationResult.data?.createOrganization.id

        const createLocation: CreateLocationArguments = {
            name: "Twitter SF Headquarters",
            address: "1355 Market St #900, San Francisco, CA 94103",
            organizationId,
        }
        const createLocationResult = await server.executeOperation({
            query: LocationQueries.CREATE_LOCATION,
            variables: createLocation
        })
        locationId = createLocationResult.data?.createLocation.id
    })

    afterAll(async () => {
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })
        for (const org of findResult.data?.allOrganizations) {
            const organizationId = org.id
            const deleteOrganization: DeleteOrganizationArguments =
                { id: organizationId }
            const deleteResult = await server.executeOperation({
                query: OrganizationQueries.DELETE_ORGANIZATION,
                variables: deleteOrganization
            })
        }
    })

    it("Creates a Location", async () => {
        expect.assertions(2)

        const createLocation: CreateLocationArguments = {
            name: "Twitter NYC Headquarters",
            address: "245 W 17th St, New York, NY 11238",
            organizationId,
        }
        const createResult = await server.executeOperation({
            query: LocationQueries.CREATE_LOCATION,
            variables: createLocation
        })

        expect(createResult.errors).toBe(undefined)
        expect(createResult.data?.createLocation.name).toBe("Twitter NYC Headquarters")
    })

    it('Fetch Location By Id', async () => {
        expect.assertions(2)
        const findLocation: FindLocationArguments = { id: locationId }
        const findResult = await server.executeOperation({
            query: LocationQueries.GET_LOCATION,
            variables: findLocation
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

        const findLocations: FindLocationArguments = { ids: locationIds }
        const results = await server.executeOperation({
            query: LocationQueries.GET_LOCATIONS,
            variables: findLocations
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

    it("Updates a Location's name", async () => {

        expect.assertions(2)

        const updateLocation: UpdateLocationArguments = {
            name: "Twitter Resort",
            id: locationId,
        }
        const updateResult = await server.executeOperation({
            query: LocationQueries.UPDATE_LOCATION,
            variables: updateLocation
        })

        expect(updateResult.errors).toBe(undefined)
        expect(updateResult.data?.updateLocation.name).toBe("Twitter Resort")
    })

    it("Update's a Location's address", async () => {
        expect.assertions(2)

        const updateLocation: UpdateLocationArguments = {
            address: "Lanai Ave, Lanai City, HI 96763",
            id: locationId,
        }

        const updateResult = await server.executeOperation({
            query: LocationQueries.UPDATE_LOCATION,
            variables: updateLocation
        })

        expect(updateResult.errors).toBe(undefined)
        expect(updateResult.data?.updateLocation.name).toBe("Twitter Resort")
    })


    it("Deletes a Location", async () => {
        expect.assertions(2)
        const expectedResult = {
            success: true
        }
        // First find the first organization that shows up and use its id

        const deleteLocation: DeleteLocationArguments = { id: locationId }
        const deleteResult = await server.executeOperation({
            query: LocationQueries.DELETE_LOCATION,
            variables: deleteLocation
        })

        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteLocation).toEqual(expectedResult)
    })
})