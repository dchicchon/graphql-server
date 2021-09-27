import { ApolloServer } from 'apollo-server'
import { CreateOrganizationArguments, DeleteOrganizationArguments, FindOrganizationArguments, OrganizationType, UpdateOrganizationArguments } from '../../../interfaces/OrganizationTypes';
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
        const organizations: Array<OrganizationType> = findResult.data?.allOrganizations;

        for (const org of organizations) {
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

        const organization: OrganizationType = result.data?.createOrganization

        expect(result.errors).toBe(undefined)
        expect(organization.name).toBe("Amazon")
    })

    // TESTS: READ
    it('Creates and Fetches Organization by Id', async () => {
        expect.assertions(3)
        const createOrganization: CreateOrganizationArguments = { name: "Google" }

        const createResult = await server.executeOperation({
            query: OrganizationQueries.CREATE_ORGANIZATION,
            variables: createOrganization
        })

        const organization: OrganizationType = createResult.data?.createOrganization

        const findOrganization: FindOrganizationArguments = { id: organization.id }
        const findResult = await server.executeOperation({
            query: OrganizationQueries.GET_ORGANIZATION,
            variables: findOrganization
        })

        const organization2: OrganizationType = findResult.data?.organization

        expect(createResult.errors).toBe(undefined)
        expect(findResult.errors).toBe(undefined)
        expect(organization2.name).toBe("Google")
    })

    it('Fetch Organizations by Ids', async () => {
        expect.assertions(2)
        const findAllResults = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = findAllResults.data?.allOrganizations
        const orgIds: Array<number> = allOrganizations.map((org) => org.id)
        const findOrganizations: FindOrganizationArguments = { ids: orgIds }
        const findResults = await server.executeOperation({
            query: OrganizationQueries.GET_ORGANIZATIONS,
            variables: findOrganizations
        })

        const organizations: Array<OrganizationType> = findResults.data?.organizations
        expect(findResults.errors).toBe(undefined)
        expect(organizations).toHaveLength(2)

    })

    it("Fetches All Organizations", async () => {
        expect.assertions(2)
        const findAllResults = await server.executeOperation({
            query: OrganizationQueries.GET_ALL_ORGANIZATIONS
        })

        const allOrganizations: Array<OrganizationType> = findAllResults.data.allOrganizations
        expect(findAllResults.errors).toBe(undefined)
        expect(allOrganizations).toHaveLength(2)
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
        const organization = allOrganizations[0]

        const updateOrganization: UpdateOrganizationArguments = {
            id: organization.id,
            name: "Amazoo"
        }

        const updateResult = await server.executeOperation({
            query: OrganizationQueries.UPDATE_ORGANIZATION,
            variables: updateOrganization
        })

        const organization2: OrganizationType = updateResult.data?.updateOrganization

        const revertOrganization: UpdateOrganizationArguments = {
            id: organization.id,
            name: "Amazon"
        }
        const revertResult = await server.executeOperation({
            query: OrganizationQueries.UPDATE_ORGANIZATION,
            variables: revertOrganization
        })


        const organization3: OrganizationType = revertResult.data?.updateOrganization


        expect(updateResult.errors).toBe(undefined)
        expect(organization.name).toBe("Amazon")
        expect(organization2.name).toBe("Amazoo")
        expect(organization3.name).toBe("Amazon")
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

        const organization: OrganizationType = createResult.data?.createOrganization

        const deleteOrganization: DeleteOrganizationArguments = { id: organization.id }
        const deleteResult = await server.executeOperation({
            query: OrganizationQueries.DELETE_ORGANIZATION,
            variables: deleteOrganization
        })

        expect(createResult.errors).toBe(undefined)
        expect(organization.name).toBe("Twitter")
        expect(deleteResult.errors).toBe(undefined)
        expect(deleteResult.data?.deleteOrganization).toEqual(expectedResult)
    })

})