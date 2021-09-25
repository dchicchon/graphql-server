"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const apollo_server_2 = require("apollo-server");
const resolvers_1 = __importDefault(require("../schema/resolvers"));
const typeDefs_1 = __importDefault(require("../schema/typeDefs"));
const api_1 = __importDefault(require("../datasources/api"));
const store_1 = __importDefault(require("../datasources/store"));
describe('resolvers', () => {
    it('fetch one organization by id', async () => {
        const store = (0, store_1.default)();
        const dataSources = () => ({
            api: new api_1.default(store)
        });
        const server = new apollo_server_2.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
        const GET_ORGANIZATION = (0, apollo_server_1.gql) `
            query GetOrganization($id: ID!) {
                organization(id: $id) {
                    id
                    name
                    createdAt
                    updatedAt
                    # locations
                    # events
                }
            }
        `;
        const results = await server.executeOperation({
            query: GET_ORGANIZATION,
            variables: { id: 1 }
        });
        expect(results.errors).toBe(undefined);
    });
    it('fetch one location by id', async () => {
        const store = (0, store_1.default)();
        const dataSources = () => ({
            api: new api_1.default(store)
        });
        const server = new apollo_server_2.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
        const GET_LOCATION = (0, apollo_server_1.gql) `
                query GetLocation($id: ID!) {
                    location(id: $id) {
                        id
                        name
                        address
                        latitude
                        longitude
                        createdAt
                        updatedAt
                        organizationId
                    }
                }
            `;
        const results = await server.executeOperation({
            query: GET_LOCATION,
            variables: { id: 1 }
        });
        expect(results.errors).toBe(undefined);
    });
    it('fetch one event by id', async () => {
        const store = (0, store_1.default)();
        const dataSources = () => ({
            api: new api_1.default(store)
        });
        const server = new apollo_server_2.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
        const GET_EVENT = (0, apollo_server_1.gql) `
                query GetEvent($id: ID!) {
                    event(id: $id) {
                        id
                        name
                        dateAndTime
                        createdAt
                        updatedAt
                        organizationId
                    }
                }
            `;
        const results = await server.executeOperation({
            query: GET_EVENT,
            variables: { id: 1 }
        });
        expect(results.errors).toBe(undefined);
    });
    it('fetch multiple organizations by ids', async () => {
        const store = (0, store_1.default)();
        const dataSources = () => ({
            api: new api_1.default(store)
        });
        const server = new apollo_server_2.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
        const GET_ORGANIZATIONS = (0, apollo_server_1.gql) `
            query GetOrganization($ids: [ID!]) {
                organizations(ids: $ids) {
                    id
                    name
                    createdAt
                    updatedAt
                    # locations
                    # events
                }
            }
        `;
        const results = await server.executeOperation({
            query: GET_ORGANIZATIONS,
            variables: { ids: [1] }
        });
        expect(results.errors).toBe(undefined);
    });
    it('fetch multiple locations by id', async () => {
        const store = (0, store_1.default)();
        const dataSources = () => ({
            api: new api_1.default(store)
        });
        const server = new apollo_server_2.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
        const GET_LOCATIONS = (0, apollo_server_1.gql) `
                query GetLocations($ids: [ID!]) {
                    locations(ids: $ids) {
                        id
                        name
                        address
                        latitude
                        longitude
                        createdAt
                        updatedAt
                        organizationId
                    }
                }
            `;
        const results = await server.executeOperation({
            query: GET_LOCATIONS,
            variables: { ids: [1] }
        });
        expect(results.errors).toBe(undefined);
    });
    it('fetch multiple events by id', async () => {
        const store = (0, store_1.default)();
        const dataSources = () => ({
            api: new api_1.default(store)
        });
        const server = new apollo_server_2.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
        const GET_EVENTS = (0, apollo_server_1.gql) `
                query GetEvents($ids: [ID!]) {
                    events(ids: $ids) {
                        id
                        name
                        dateAndTime
                        createdAt
                        updatedAt
                        organizationId
                    }
                }
            `;
        const results = await server.executeOperation({
            query: GET_EVENTS,
            variables: { ids: [1] }
        });
        expect(results.errors).toBe(undefined);
    });
    it('fetches all organizations', async () => {
        const store = (0, store_1.default)();
        const dataSources = () => ({
            api: new api_1.default(store)
        });
        const server = new apollo_server_2.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
        const GET_ORGANIZATIONS = (0, apollo_server_1.gql) `
            query GetOrganizations {
                allOrganizations {
                    id
                    name
                    createdAt
                    updatedAt
                    # locations
                    # events
                }
            }
        `;
        const results = await server.executeOperation({
            query: GET_ORGANIZATIONS
        });
        expect(results.errors).toBe(undefined);
    });
    it("fetches all locations", async () => {
        const store = (0, store_1.default)();
        const dataSources = () => ({
            api: new api_1.default(store)
        });
        const server = new apollo_server_2.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
        const GET_LOCATIONS = (0, apollo_server_1.gql) `
            query GetLocations {
                allLocations {
                    id
                    name
                    address
                    latitude
                    longitude
                    createdAt
                    updatedAt
                    organizationId
                    # organization
                }
            }
        `;
        const results = await server.executeOperation({
            query: GET_LOCATIONS
        });
        expect(results.errors).toBe(undefined);
    });
    it("fetches all events", async () => {
        const store = (0, store_1.default)();
        const dataSources = () => ({
            api: new api_1.default(store)
        });
        const server = new apollo_server_2.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
        const GET_EVENTS = (0, apollo_server_1.gql) `
            query GetEvents {
                allEvents {
                    id
                    name
                    dateAndTime
                    createdAt
                    updatedAt
                    organizationId
                    # organization
                }
            }
        `;
        const results = await server.executeOperation({
            query: GET_EVENTS
        });
        expect(results.errors).toBe(undefined);
    });
});
