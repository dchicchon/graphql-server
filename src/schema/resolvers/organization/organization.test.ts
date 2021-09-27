import { ApolloServer } from 'apollo-server'
import { CreateOrganizationArguments, DeleteOrganizationArguments, FindOrganizationArguments, UpdateOrganizationArguments } from '../../../interfaces/OrganizationTypes';
import { createTestServer } from '../../testUtils/createTestServer'
import * as OrganizationQueries from '../../testUtils/organizationQueries'


describe("Organization Resolvers", () => {
    let server: ApolloServer;
    beforeAll(async () => {
        server = await createTestServer()
        // maybe inject some data into the database beforehand and then delete afterwards
    })

    afterAll(async () => {
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })
        for (const org of findResult.data?.allOrganizations) {
            const organizationId = org.id

            const deleteOrganization: DeleteOrganizationArguments = { id: organizationId }
            const deleteResult = await server.executeOperation({
                query: OrganizationQueries.DELETE_ORGANIZATION,
                variables: deleteOrganization
            })
        }
    })
    // TESTS: CREATE
    it("Create an Organization", async () => {
        expect.assertions(2)
        const createOrganization: CreateOrganizationArguments = { name: "Amazon" }
        const result = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: createOrganization
        })

        expect(result.errors).toBe(undefined)
        expect(result.data?.createOrganization.name).toBe("Amazon")
    })

    // TESTS: READ
    it('Creates and Fetches Organization by Id', async () => {
        expect.assertions(3)
        const createOrganization: CreateOrganizationArguments = { name: "Google" }

        const createResult = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: createOrganization
        })

        const organizationId = createResult.data?.createOrganization.id

        const findOrganization: FindOrganizationArguments = { id: organizationId }
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ORGANIZATION,
            variables: findOrganization
        })

        expect(createResult.errors).toBe(undefined)
        expect(findResult.errors).toBe(undefined)
        expect(createResult.data?.createOrganization.name).toBe("Google")
    })

    it('Fetch Organizations by Ids', async () => {
        expect.assertions(2)
        const findAllResults = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const orgIds = findAllResults.data?.allOrganizations.map((org: any) => org.id)
        const findOrganizations: FindOrganizationArguments = { ids: orgIds }
        const findResults = await server.executeOperation({
            query: OrganizationQueries.GET_ORGANIZATIONS,
            variables: findOrganizations
        })

        expect(findResults.errors).toBe(undefined)
        expect(findResults.data?.organizations).toHaveLength(2)

    })

    it("Fetches All Organizations", async () => {
        expect.assertions(2)
        const findAllResults = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
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
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS,
        })

        const organizationId = findResult.data?.allOrganizations[0].id

        // console.log(findResult.data?.allOrganizations)

        const updateOrganization: UpdateOrganizationArguments = {
            id: organizationId,
            name: "Amazoo"
        }
        const updateResult = await server.executeOperation({
            query: OrganizationQueries.UPDATE_ORGANIZATION,
            variables: updateOrganization
        })

        const revertOrganization: UpdateOrganizationArguments = {
            id: organizationId,
            name: "Amazon"
        }
        const revertResult = await server.executeOperation({
            query: OrganizationQueries.UPDATE_ORGANIZATION,
            variables: revertOrganization
        })

        expect(updateResult.errors).toBe(undefined)
        expect(findResult.data?.allOrganizations[0].name).toBe("Amazon")
        expect(updateResult.data?.updateOrganization.name).toBe("Amazoo")
        expect(revertResult.data?.updateOrganization.name).toBe("Amazon")
    })

    // TESTS: DELETE
    it("Create and Deletes an organization", async () => {
        expect.assertions(4)

        const createOrganization: CreateOrganizationArguments = { name: "Twitter" }

        const createResult = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: createOrganization
        })

        const expectedResult = {
            success: true
        }

        const organizationId = createResult.data?.createOrganization.id


        const deleteOrganization: DeleteOrganizationArguments = { id: organizationId }
        const deleteResult = await server.executeOperation({
            query: OrganizationQueries.DELETE_ORGANIZATION,
            variables: deleteOrganization
        })

        expect(createResult.errors).toBe(undefined)
        expect(createResult.data?.createOrganization.name).toBe("Twitter")
        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteOrganization).toEqual(expectedResult)
    })

})