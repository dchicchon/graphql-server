import { ApolloServer } from 'apollo-server'
import * as Queries from '../testUtils/Queries'
import { resolvers as organizationResolvers } from './organization'
import { resolvers as locationResolvers } from './location'
import { resolvers as eventResolvers } from './event'
import { resolvers as utilResolvers } from './util'
import { typeDefs as organizationDefs } from '../typeDefs/organization'
import { typeDefs as locationDefs } from '../typeDefs/location'
import { typeDefs as eventDefs } from '../typeDefs/event'
import API from '../../datasources/api'
import { createTestStore } from '../../datasources/store'
import Organization from '../../datasources/api/organization'
import Location from '../../datasources/api/location'
import Event from '../../datasources/api/event'
import { config } from 'dotenv'
import { createTestServer } from '../testUtils/createTestServer'


describe("Organization Resolvers", () => {
    let server: ApolloServer;
    beforeAll(async () => {
        server = await createTestServer()
        // maybe inject some data into the database beforehand and then delete afterwards
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
    // TESTS: CREATE
    it("Create an Organization", async () => {
        expect.assertions(2)
        const result = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Amazon" }
        })

        expect(result.errors).toBe(undefined)
        expect(result.data?.createOrganization.name).toBe("Amazon")
    })

    // TESTS: READ
    it('Creates and Fetches Organization by Id', async () => {
        expect.assertions(3)

        const createResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Google" }
        })

        const organizationId = createResult.data?.createOrganization.id

        const findResult = await server.executeOperation({
            query: Queries.GET_ORGANIZATION,
            variables: { id: organizationId }
        })

        expect(createResult.errors).toBe(undefined)
        expect(findResult.errors).toBe(undefined)
        expect(createResult.data?.createOrganization.name).toBe("Google")
    })

    it('Fetch Organizations by Ids', async () => {
        expect.assertions(2)
        const findAllResults = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })

        const orgIds = findAllResults.data?.allOrganizations.map((org: any) => org.id)
        const findResults = await server.executeOperation({
            query: Queries.GET_ORGANIZATIONS,
            variables: { ids: orgIds }
        })

        expect(findResults.errors).toBe(undefined)
        expect(findResults.data?.organizations).toHaveLength(2)

    })

    it("Fetches All Organizations", async () => {
        expect.assertions(2)
        const findAllResults = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        })
        expect(findAllResults.errors).toBe(undefined)
        expect(findAllResults.data?.allOrganizations).toHaveLength(2)
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
                name: "Amazoo"
            }
        })

        const revertResult = await server.executeOperation({
            query: Queries.UPDATE_ORGANIZATION,
            variables: {
                id: organizationId,
                name: "Amazon"
            }
        })

        // console.log(updateResult)

        expect(updateResult.errors).toBe(undefined)
        expect(findResult.data?.allOrganizations[0].name).toBe("Amazon")
        expect(updateResult.data?.updateOrganization.name).toBe("Amazoo")
        expect(revertResult.data?.updateOrganization.name).toBe("Amazon")
    })

    // TESTS: DELETE
    it("Create and Deletes an organization", async () => {
        expect.assertions(4)

        const createResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Twitter" }
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
        expect(createResult.data?.createOrganization.name).toBe("Twitter")
        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteOrganization).toEqual(expectedResult)
    })

})