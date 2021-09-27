import { ApolloServer } from 'apollo-server'
import { createTestServer } from '../../testUtils/createTestServer'
import * as EventQueries from '../../testUtils/eventQueries'
import * as OrganizationQueries from '../../testUtils/organizationQueries'
import { CreateEventArguments, DeleteEventArguments, EventType, FindEventArguments, UpdateEventArguments } from '../../../interfaces/EventTypes'
import { CreateOrganizationArguments } from '../../../interfaces/OrganizationTypes'

describe('All Resolvers', () => {
    let server: ApolloServer;
    let organizationId: any;
    let eventId: any;

    beforeAll(async () => {
        server = await createTestServer();
        const newOrganization: CreateOrganizationArguments = {
            name: "Facebook"
        }
        const createOrganizationResult = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: newOrganization
        })
        organizationId = createOrganizationResult.data?.createOrganization.id
        const newEvent: CreateEventArguments = {
            name: "Expunge User Data",
            description: "NSA is coming by soon. Delete everything!",
            dateAndTime: new Date('12/12/2021'),
            organizationId
        }

        const createEventResult = await server.executeOperation({
            query: EventQueries.CREATE_EVENT,
            variables: newEvent
        })
        eventId = createEventResult.data?.createEvent.id
        // maybe inject some data into the database beforehand and then delete afterwards
    })

    afterAll(async () => {
        // Delete all remaining organizations
        const result = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })
        for (const org of result.data?.allOrganizations) {
            const deleteArg: DeleteEventArguments = {
                id: org.id
            }
            await server.executeOperation({
                query: OrganizationQueries.DELETE_ORGANIZATION,
                variables: deleteArg
            })
        }

        // console.log(result2.data?.allOrganizations) // this should be 0

    })

    it("Creates an Event", async () => {
        expect.assertions(2)
        // Find the first result and add this location to it
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const organizationId = findResult.data?.allOrganizations[0].id

        const newEvent: CreateEventArguments = {
            name: "Mark's Birthday",
            dateAndTime: new Date('12/22/2022'),
            description: "Mark is having people over his place for BBQ",
            organizationId,
        }
        const eventResult = await server.executeOperation({
            query: EventQueries.CREATE_EVENT,
            variables: newEvent
        })

        const event: EventType = eventResult.data?.createEvent
        expect(eventResult.errors).toBe(undefined)
        expect(event.name).toBe("Mark's Birthday")

    })

    it('Fetch Event By Id', async () => {
        expect.assertions(2)
        const findEvent: FindEventArguments = { id: eventId }
        const results = await server.executeOperation({
            query: EventQueries.GET_EVENT,
            variables: findEvent
        })

        const event: EventType = results.data?.event
        expect(results.errors).toBe(undefined)
        expect(event.name).toBe("Expunge User Data")
    })

    it('Fetch Events By Ids', async () => {
        expect.assertions(2)
        const findEvents: FindEventArguments = {
            ids: [eventId]
        }
        const results = await server.executeOperation({
            query: EventQueries.GET_EVENTS,
            variables: findEvents
        })

        const events: Array<EventType> = results.data?.events
        expect(results.errors).toBe(undefined)
        expect(events).toHaveLength(1)
    })

    it("Fetch All Events", async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: EventQueries.GET_ALL_EVENTS
        })

        const events: Array<EventType> = findResults.data?.allEvents

        expect(findResults.errors).toBe(undefined)
        expect(events).toHaveLength(2)

    })


    it("Updates an Event", async () => {
        expect.assertions(2)

        const updateEvent: UpdateEventArguments = {
            id: eventId,
            name: "Not Expunging Data",
            dateAndTime: new Date('12/18/2021'),
            description: "We're not expunging data! Just cleaning up house",
        }
        const updateResult = await server.executeOperation({
            query: EventQueries.UPDATE_EVENT,
            variables: updateEvent
        })

        const event: EventType = updateResult.data?.updateEvent

        expect(updateResult.errors).toBe(undefined)
        expect(event.name).toBe("Not Expunging Data")
    })

    it("Partially Updates an Event", async () => {
        expect.assertions(4)

        const updateEvent: UpdateEventArguments = {
            id: eventId,
            name: "Okay we're Expunging Data",
            description: "You caught us, we're deleting our data :(",
        }
        const updateResult = await server.executeOperation({
            query: EventQueries.UPDATE_EVENT,
            variables: updateEvent
        })

        const event: EventType = updateResult.data?.updateEvent;

        const updateEvent2: UpdateEventArguments = {
            id: eventId,
            name: "Expunge Data Party",
        }

        const updateResult2 = await server.executeOperation({
            query: EventQueries.UPDATE_EVENT,
            variables: updateEvent2
        })

        const event2: EventType = updateResult2.data?.updateEvent

        expect(updateResult.errors).toBe(undefined)
        expect(event.name).toBe("Okay we're Expunging Data")

        expect(updateResult2.errors).toBe(undefined)
        expect(event2.name).toBe("Expunge Data Party")

    })

    it("Creates and Deletes an Event", async () => {
        const expectedResult = {
            success: true
        }

        const createEvent: CreateEventArguments = {
            name: "Stockholder Meeting",
            dateAndTime: new Date('11/11/2021'),
            description: "Gathering all of the stockholders in order to talk about the company's future",
            organizationId,
        }


        const createResult = await server.executeOperation({
            query: EventQueries.CREATE_EVENT,
            variables: createEvent
        })

        const event: EventType = createResult.data?.createEvent

        const deleteEvent: DeleteEventArguments = {
            id: event.id
        }

        const deleteResult = await server.executeOperation({
            query: EventQueries.DELETE_EVENT,
            variables: deleteEvent
        })

        expect(createResult.errors).toBe(undefined)
        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteEvent).toEqual(expectedResult)
    })



})