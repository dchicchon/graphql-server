/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'apollo-server'
import { Organization, Store } from '../interfaces/Types'
import { ApolloServer } from 'apollo-server'
import resolvers from '../schema/resolvers'
import typeDefs from '../schema/typeDefs'
import organizationSample from '../testUtils/organizationSample'
import API from '../datasources/api'
import createStore from '../datasources/store'

describe('resolvers', () => {
    it('fetches all organizations', async () => {
        const store: Store = createStore();
        const dataSources = () => ({
            api: new API(store)
        })
        const server = new ApolloServer({ typeDefs, resolvers, dataSources })

        // start using executeOperation to test my server
        const GET_ORGANIZATIONS = gql`
            query GetOrganizations {
                allOrganizations {
                    id
                    name
                }
            }
        `;

        const results = await server.executeOperation({
            query: GET_ORGANIZATIONS
        })

        expect(results.errors).toBe(undefined)

    })

    it('creates an organization', async () => {
        const store: Store = createStore();
        const dataSources = () => ({
            api: new API(store)
        })
        const server = new ApolloServer({ typeDefs, resolvers, dataSources })

        const CREATE_ORGANIZATION = gql`

            mutation CreateOrganization($newOrganization: )

        `;
        const results = await server.executeOperation({
            query: CREATE_ORGANIZATION,
            variables: { name: 'Econify' }
        })

        expect(results.errors).toBe(undefined)

        // start using executeOperation to test my server
    })
})