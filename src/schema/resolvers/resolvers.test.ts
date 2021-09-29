import { ApolloServer } from 'apollo-server'
import { createTestServer } from '../testUtils/createTestServer'
import * as OrganizationQueries from '../testUtils/organizationQueries'
import * as LocationQueries from '../testUtils/locationQueries'
import * as EventQueries from '../testUtils/eventQueries'
import { CreateOrganizationArguments, DeleteOrganizationArguments, FindOrganizationArguments, OrganizationType, UpdateOrganizationArguments } from '../../interfaces/OrganizationTypes'
import { CreateLocationArguments, DeleteLocationArguments, FindLocationArguments, LocationType, UpdateLocationArguments } from '../../interfaces/LocationTypes'
import { CreateEventArguments, DeleteEventArguments, EventType, FindEventArguments } from '../../interfaces/EventTypes'

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
        server = await createTestServer()
        // maybe inject some data into the database beforehand and then delete afterwards
    })

    afterAll(async () => {
        // Delete all remaining organizations
        const result = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = result.data?.allOrganizations
        for (const org of allOrganizations) {
            await server.executeOperation({
                query: OrganizationQueries.DELETE_ORGANIZATION,
                variables: {
                    id: org.id
                }
            })
        }
        const result2 = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })
        // console.log(result2.data?.allOrganizations) // this should be 0

    })

    // TESTS: CREATE
    it("Create an Organization", async () => {
        expect.assertions(2)

        const createOrganization: CreateOrganizationArguments = {
            name: "Polus"
        }

        const result = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: createOrganization
        })

        const organization: OrganizationType = result.data?.createOrganization
        expect(result.errors).toBe(undefined)
        expect(organization.name).toBe("Polus")
    })

    it("Creates a Location", async () => {
        expect.assertions(4)

        // Find the first result and add this location to it
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = findResult.data?.allOrganizations;
        const createLocation: CreateLocationArguments = {
            name: "Polus Headquarters",
            address: "205 W 109th Street, New York, New York 100025",
            organizationId: allOrganizations[0].id,
        }
        // First find the first organization that shows up and use its id

        const createResult = await server.executeOperation({
            query: LocationQueries.CREATE_LOCATION,
            variables: createLocation
        })

        const location: LocationType = createResult.data?.createLocation

        expect(findResult.errors).toBe(undefined)
        expect(allOrganizations).toHaveLength(1)
        expect(createResult.errors).toBe(undefined)
        expect(location.name).toBe("Polus Headquarters")
    })

    it("Creates an Event", async () => {
        expect.assertions(2)

        // Find the first result and add this location to it
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })
        const allOrganizations: Array<OrganizationType> = findResult.data?.allOrganizations;
        const createEvent: CreateEventArguments = {
            name: "Party!",
            dateAndTime: new Date('10/12/2021'),
            description: "A gathering of friends",
            organizationId: allOrganizations[0].id,
        }
        const eventResult = await server.executeOperation({
            query: EventQueries.CREATE_EVENT,
            variables: createEvent
        })

        const event: EventType = eventResult.data?.createEvent

        expect(eventResult.errors).toBe(undefined)
        expect(event.name).toBe("Party!")

    })

    // TESTS: READ
    it('Fetch Organization by Id', async () => {
        expect.assertions(2)

        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })
        const allOrganizations: Array<OrganizationType> = findResult.data?.allOrganizations;
        const findOrganization: FindOrganizationArguments = { id: allOrganizations[0].id } // this is wrong
        const results = await server.executeOperation({
            query: OrganizationQueries.GET_ORGANIZATION,
            variables: findOrganization
        })

        const organization: OrganizationType = results.data?.organization
        expect(results.errors).toBe(undefined)
        expect(organization.name).toBe("Polus")
    })

    it('Fetch Location By Id', async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: LocationQueries.GET_ALL_LOCATIONS
        })

        const allLocations: Array<LocationType> = findResults.data?.allLocations

        const findLocation: FindLocationArguments = { id: allLocations[0].id }
        const results = await server.executeOperation({
            query: LocationQueries.GET_LOCATION,
            variables: findLocation
        })

        const location: LocationType = results.data?.location
        expect(results.errors).toBe(undefined)
        expect(location.name).toBe("Polus Headquarters")
    })

    it('Fetch Event By Id', async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: EventQueries.GET_ALL_EVENTS
        })


        const allEvents: Array<EventType> = findResults.data?.allEvents
        const findEventById: FindEventArguments = { id: allEvents[0].id }
        const results = await server.executeOperation({
            query: EventQueries.GET_EVENT,
            variables: findEventById
        })

        const event: EventType = results.data?.event
        // console.log("Find Event Test")
        // console.log(results)

        expect(results.errors).toBe(undefined)
        expect(event.name).toBe("Party!")
    })

    it('Fetches Organizations by Id', async () => {
        expect.assertions(3)

        const findAllResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = findAllResult.data?.allOrganizations
        const findOrganizations: FindOrganizationArguments = { ids: allOrganizations.map((org) => (org.id)) }

        const findResults = await server.executeOperation({
            query: OrganizationQueries.GET_ORGANIZATIONS,
            variables: findOrganizations
        })

        const organizations: Array<OrganizationType> = findResults.data?.organizations
        expect(findResults.errors).toBe(undefined)
        expect(organizations[0].name).toBe("Polus")
        expect(organizations).toHaveLength(1)
    })



    it('Fetch Locations By Ids', async () => {
        expect.assertions(3)

        const findAllResult = await server.executeOperation({
            query: LocationQueries.GET_ALL_LOCATIONS
        })

        const allLocations: Array<LocationType> = findAllResult.data?.allLocations
        const findLocations: FindLocationArguments = { ids: allLocations.map((location) => location.id) }

        const findResults = await server.executeOperation({
            query: LocationQueries.GET_LOCATIONS,
            variables: findLocations
        })

        const locations: Array<LocationType> = findResults.data?.locations

        expect(findResults.errors).toBe(undefined)
        expect(locations[0].name).toBe("Polus Headquarters")
        expect(locations).toHaveLength(1)
    })

    it('Fetch Events By Ids', async () => {
        expect.assertions(3)

        const findAllResult = await server.executeOperation({
            query: EventQueries.GET_ALL_EVENTS
        })

        const allEvents: Array<EventType> = findAllResult.data?.allEvents
        const findEventArguments: FindEventArguments = { ids: allEvents.map((event) => event.id) }

        const findResults = await server.executeOperation({
            query: EventQueries.GET_EVENTS,
            variables: findEventArguments
        })

        const events: Array<EventType> = findResults.data?.events
        expect(findResults.errors).toBe(undefined)
        expect(events).toHaveLength(1)
        expect(events[0].name).toBe("Party!")
    })

    it("Fetches All Locations", async () => {
        expect.assertions(2)
        const result = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = result.data?.allOrganizations
        expect(result.errors).toBe(undefined)
        expect(allOrganizations).toHaveLength(1)

    })

    it("Fetch All Locations", async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: LocationQueries.GET_ALL_LOCATIONS
        })

        const allLocations: Array<LocationType> = findResults.data?.allLocations

        expect(findResults.errors).toBe(undefined)
        expect(allLocations).toHaveLength(1)

    })
    it("Fetch All Events", async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: EventQueries.GET_ALL_EVENTS
        })

        const allEvents: Array<EventType> = findResults.data?.allEvents
        expect(findResults.errors).toBe(undefined)
        expect(allEvents).toHaveLength(1)

    })

    // TESTS: UPDATE
    it("Updates an Organization", async () => {
        expect.assertions(4)
        // console.log("Updating an Organization")
        // First find the first item in our database and update it
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS,
        })

        const allOrganizations: Array<OrganizationType> = findResult.data?.allOrganizations
        const updateOrganization: UpdateOrganizationArguments = {
            id: allOrganizations[0].id,
            name: "Pola"
        }


        const updateResult = await server.executeOperation({
            query: OrganizationQueries.UPDATE_ORGANIZATION,
            variables: updateOrganization
        })

        const updatedOrganization: OrganizationType = updateResult.data?.updateOrganization

        const revertOrganization: UpdateOrganizationArguments = {
            id: allOrganizations[0].id,
            name: "Polus"
        }

        const revertResult = await server.executeOperation({
            query: OrganizationQueries.UPDATE_ORGANIZATION,
            variables: revertOrganization
        })

        const revertedOrganization: OrganizationType = revertResult.data?.updateOrganization


        expect(updateResult.errors).toBe(undefined)
        expect(allOrganizations[0].name).toBe("Polus")
        expect(updatedOrganization.name).toBe("Pola")
        expect(revertedOrganization.name).toBe("Polus")
    })

    it("Updates a Location", async () => {

        expect.assertions(4)
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = findResult.data?.allOrganizations
        const updateLocation: UpdateLocationArguments = {
            id: allOrganizations[0].locations[0].id,
            name: "Polus Resort"
        }

        const updateResult = await server.executeOperation({
            query: LocationQueries.UPDATE_LOCATION,
            variables: updateLocation
        })

        const updatedLocation: LocationType = updateResult.data?.updateLocation
        expect(findResult.errors).toBe(undefined)
        expect(allOrganizations[0].locations[0].name).toBe("Polus Headquarters")
        expect(updateResult.errors).toBe(undefined)
        expect(updatedLocation.name).toBe("Polus Resort")
    })

    it("Updates an Event", async () => {
        expect.assertions(4)
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = findResult.data?.allOrganizations
        const updateEvent = {
            id: allOrganizations[0].events[0].id,
            name: "Birthday",
            dateAndTime: new Date('12/18/2021'),
            description: "It's my birthday!",
        }

        const updateResult = await server.executeOperation({
            query: EventQueries.UPDATE_EVENT,
            variables: updateEvent
        })

        const event: EventType = updateResult.data?.updateEvent

        expect(findResult.errors).toBe(undefined)
        expect(allOrganizations[0].events[0].name).toBe("Party!")
        expect(updateResult.errors).toBe(undefined)
        expect(event.name).toBe("Birthday")
    })


    // TESTS: DELETE
    it("Create and Deletes an organization", async () => {
        expect.assertions(4)


        const createOrganization: CreateOrganizationArguments = { name: "Google" }
        const createResult = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: createOrganization
        })

        const expectedResult = {
            success: true
        }

        const organization: OrganizationType = createResult.data?.createOrganization
        const deleteOrganization: DeleteOrganizationArguments = { id: organization.id }
        const deleteResult = await server.executeOperation({
            query: OrganizationQueries.DELETE_ORGANIZATION,
            variables: deleteOrganization
        })

        expect(createResult.errors).toBe(undefined)
        expect(organization.name).toBe("Google")
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
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = findResult.data?.allOrganizations

        const createLocation: CreateLocationArguments = {
            name: "Company Island",
            address: "23 Happy Valley Rd, Pembroke, Bermuda",
            organizationId: allOrganizations[0].id,
        }
        // First find the first organization that shows up and use its id

        const createResult = await server.executeOperation({
            query: LocationQueries.CREATE_LOCATION,
            variables: createLocation
        })

        const location: LocationType = createResult.data?.createLocation

        const deleteLocation: DeleteLocationArguments = { id: location.id }
        const deleteResult = await server.executeOperation({
            query: LocationQueries.DELETE_LOCATION,
            variables: deleteLocation
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
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = findResult.data?.allOrganizations

        const createEvent: CreateEventArguments = {
            name: "Stockholder Meeting",
            dateAndTime: new Date('11/11/2021'),
            description: "Gathering all of the stockholders in order to talk about the company's future",
            organizationId: allOrganizations[0].id,
        }
        // First find the first organization that shows up and use its id

        const createResult = await server.executeOperation({
            query: EventQueries.CREATE_EVENT,
            variables: createEvent
        })

        const event: EventType = createResult.data?.createEvent
        const deleteEvent: DeleteEventArguments = { id: event.id }

        const deleteResult = await server.executeOperation({
            query: EventQueries.DELETE_EVENT,
            variables: deleteEvent
        })

        expect(findResult.errors).toBe(undefined)
        expect(createResult.errors).toBe(undefined)
        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteEvent).toEqual(expectedResult)
    })



})