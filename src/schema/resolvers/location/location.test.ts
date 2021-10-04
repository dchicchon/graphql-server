import { ApolloServer } from 'apollo-server'
import { CreateLocationArguments, DeleteLocationArguments, FindLocationArguments, LocationType, UpdateLocationArguments } from '../../../interfaces/LocationTypes'
import { CreateOrganizationArguments, DeleteOrganizationArguments, OrganizationType } from '../../../interfaces/OrganizationTypes'
import { createTestServer } from '../../testUtils/createTestServer'
import * as LocationQueries from '../../testUtils/locationQueries'
import * as OrganizationQueries from '../../testUtils/organizationQueries'


// Make multiple tests for resolvers probably
// Resolvers Test
describe('resolvers', () => {
    let server: ApolloServer;
    let organizationId: number;
    let locationId: number;
    beforeAll(async () => {
        server = await createTestServer();

        // create some data here

        const createOrganization: CreateOrganizationArguments = { name: 'Twitter' }

        const createOrganizationResult = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: createOrganization
        })

        const organization: OrganizationType = createOrganizationResult.data?.createOrganization

        const createLocation: CreateLocationArguments = {
            name: 'Twitter SF Headquarters',
            address: '1355 Market St #900, San Francisco, CA 94103',
            organizationId: organization.id,
        }
        const createLocationResult = await server.executeOperation({
            query: LocationQueries.CREATE_LOCATION,
            variables: createLocation
        })
        const location: LocationType = createLocationResult.data?.createLocation
        organizationId = organization.id
        locationId = location.id
    })

    afterAll(async () => {
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })
        const organizations: Array<OrganizationType> = findResult.data?.allOrganizations
        for (const org of organizations) {
            const organizationId = org.id
            const deleteOrganization: DeleteOrganizationArguments =
                { id: organizationId }
            const deleteResult = await server.executeOperation({
                query: OrganizationQueries.DELETE_ORGANIZATION,
                variables: deleteOrganization
            })
        }
    })

    it('Creates a Location', async () => {
        expect.assertions(2)

        const createLocation: CreateLocationArguments = {
            name: 'Twitter NYC Headquarters',
            address: '245 W 17th St, New York, NY 11238',
            organizationId,
        }
        const createResult = await server.executeOperation({
            query: LocationQueries.CREATE_LOCATION,
            variables: createLocation
        })

        const location: LocationType = createResult.data?.createLocation
        expect(createResult.errors).toBe(undefined)
        expect(location.name).toBe('Twitter NYC Headquarters')
    })

    it('Fetch Location By Id', async () => {
        expect.assertions(2)
        const findLocation: FindLocationArguments = { id: locationId }
        const findResult = await server.executeOperation({
            query: LocationQueries.GET_LOCATION,
            variables: findLocation
        })

        const location: LocationType = findResult.data?.location
        expect(findResult.errors).toBe(undefined)
        expect(location.name).toBe('Twitter SF Headquarters')

    })

    it('Fetch Locations By Ids', async () => {
        expect.assertions(2)

        const findAllResults = await server.executeOperation({
            query: LocationQueries.GET_ALL_LOCATIONS
        })

        const allLocations: Array<LocationType> = findAllResults.data?.allLocations
        const locationIds: Array<number> = allLocations.map((location: any) => location.id)

        const findLocations: FindLocationArguments = { ids: locationIds }
        const findResults = await server.executeOperation({
            query: LocationQueries.GET_LOCATIONS,
            variables: findLocations
        })

        const locations: Array<LocationType> = findResults.data?.locations

        expect(findResults.errors).toBe(undefined)
        expect(locations).toHaveLength(2)
    })

    it('Fetch All Locations', async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: LocationQueries.GET_ALL_LOCATIONS
        })

        const allLocations: Array<LocationType> = findResults.data?.allLocations

        expect(findResults.errors).toBe(undefined)
        expect(allLocations).toHaveLength(2)

    })

    it('Updates a Locations name', async () => {

        expect.assertions(2)

        const updateLocation: UpdateLocationArguments = {
        name: 'Twitter Resort',
        id: locationId,
    }
    const updateResult = await server.executeOperation({
        query: LocationQueries.UPDATE_LOCATION,
        variables: updateLocation
    })

    const location: LocationType = updateResult.data?.updateLocation
    expect(updateResult.errors).toBe(undefined)
    expect(location.name).toBe('Twitter Resort')
})

it('Updates a Locations address', async () => {
    expect.assertions(2)

    const updateLocation: UpdateLocationArguments = {
        address: 'Lanai Ave, Lanai City, HI 96763',
        id: locationId,
    }

    const updateResult = await server.executeOperation({
        query: LocationQueries.UPDATE_LOCATION,
        variables: updateLocation
    })

    const location: LocationType = updateResult.data?.updateLocation

    expect(updateResult.errors).toBe(undefined)
    expect(location.name).toBe('Twitter Resort')
})


it('Deletes a Location', async () => {
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