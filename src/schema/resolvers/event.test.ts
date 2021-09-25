import { ApolloServer } from 'apollo-server'
import { createTestServer } from '../testUtils/createTestServer'
import * as EventQueries from '../testUtils/eventQueries'
import * as OrganizationQueries from '../testUtils/organizationQueries'

describe('All Resolvers', () => {
    let server: ApolloServer;
    let organizationId: any;
    let eventId: any;

    beforeAll(async () => {
        server = await createTestServer();
        const createOrganizationResult = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: { name: "Facebook" }
        })
        organizationId = createOrganizationResult.data?.createOrganization.id
        const createEventResult = await server.executeOperation({
            query: EventQueries.CREATE_EVENT,
            variables: {
                name: "Expunge User Data",
                description: "NSA is coming by soon. Delete everything!",
                dateAndTime: new Date('12/12/2021'),
                organizationId,
            }
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
            await server.executeOperation({
                query: OrganizationQueries.DELETE_ORGANIZATION,
                variables: {
                    id: org.id
                }
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

        const eventResult = await server.executeOperation({
            query: EventQueries.CREATE_EVENT,
            variables: {
                name: "Mark's Birthday",
                dateAndTime: new Date('12/22/2022'),
                description: "Mark is having people over his place for BBQ",
                organizationId,
            }
        })

        expect(eventResult.errors).toBe(undefined)
        expect(eventResult.data?.createEvent.name).toBe("Mark's Birthday")

    })

    it('Fetch Event By Id', async () => {
        expect.assertions(2)
        const results = await server.executeOperation({
            query: EventQueries.GET_EVENT,
            variables: { id: eventId }
        })

        expect(results.errors).toBe(undefined)
        expect(results.data?.event.name).toBe("Expunge User Data")
    })

    it('Fetch Events By Ids', async () => {
        expect.assertions(1)



        const results = await server.executeOperation({
            query: EventQueries.GET_EVENTS,
            variables: { ids: [1] }
        })

        expect(results.errors).toBe(undefined)
    })

    it("Fetch All Events", async () => {
        expect.assertions(2)

        const findResults = await server.executeOperation({
            query: EventQueries.GET_ALL_EVENTS
        })

        expect(findResults.errors).toBe(undefined)
        expect(findResults.data?.allEvents).toHaveLength(2)

    })


    it("Updates an Event", async () => {
        expect.assertions(2)

        const updateResult = await server.executeOperation({
            query: EventQueries.UPDATE_EVENT,
            variables: {
                id: eventId,
                name: "Not Expunging Data",
                dateAndTime: new Date('12/18/2021'),
                description: "We're not expunging data! Just cleaning up house",
            }
        })


        expect(updateResult.errors).toBe(undefined)
        expect(updateResult.data?.updateEvent.name).toBe("Not Expunging Data")
    })

    it("Partially Updates an Event", async () => {
        expect.assertions(4)

        const updateResult = await server.executeOperation({
            query: EventQueries.UPDATE_EVENT,
            variables: {
                id: eventId,
                name: "Okay we're Expunging Data",
                description: "You caught us, we're deleting our data :(",
            }
        })

        const updateResult2 = await server.executeOperation({
            query: EventQueries.UPDATE_EVENT,
            variables: {
                id: eventId,
                name: "Expunge Data Party",
            }
        })

        expect(updateResult.errors).toBe(undefined)
        expect(updateResult.data?.updateEvent.name).toBe("Okay we're Expunging Data")

        expect(updateResult2.errors).toBe(undefined)
        expect(updateResult2.data?.updateEvent.name).toBe("Expunge Data Party")

    })

    it("Creates and Deletes an Event", async () => {
        const expectedResult = {
            success: true
        }
        const createResult = await server.executeOperation({
            query: EventQueries.CREATE_EVENT,
            variables: {
                name: "Stockholder Meeting",
                dateAndTime: new Date('11/11/2021'),
                description: "Gathering all of the stockholders in order to talk about the company's future",
                organizationId,
            }
        })

        const eventId = createResult.data?.createEvent.id

        const deleteResult = await server.executeOperation({
            query: EventQueries.DELETE_EVENT,
            variables: { id: eventId }
        })

        expect(createResult.errors).toBe(undefined)
        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteEvent).toEqual(expectedResult)
    })



})