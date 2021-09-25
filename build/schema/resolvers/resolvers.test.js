"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const Queries = __importStar(require("../testQueries"));
const organization_1 = require("./organization");
const location_1 = require("./location");
const event_1 = require("./event");
const util_1 = require("./util");
const organization_2 = require("../typeDefs/organization");
const location_2 = require("../typeDefs/location");
const event_2 = require("../typeDefs/event");
const api_1 = __importDefault(require("../../datasources/api"));
const store_1 = __importDefault(require("../../datasources/store"));
const organization_3 = __importDefault(require("../../datasources/api/organization"));
const location_3 = __importDefault(require("../../datasources/api/location"));
const event_3 = __importDefault(require("../../datasources/api/event"));
const dotenv_1 = require("dotenv");
describe("Testing Jest", () => {
    it("Runs a test", async () => {
        const item = 1;
        expect(item).toBe(1);
    });
});
describe('resolvers', () => {
    let server;
    beforeAll(async () => {
        (0, dotenv_1.config)();
        const store = (0, store_1.default)();
        const organizationAPI = new organization_3.default(store.organization);
        const locationAPI = new location_3.default(store.location);
        const eventAPI = new event_3.default(store.event);
        const dataSources = () => ({
            api: new api_1.default(organizationAPI, locationAPI, eventAPI)
        });
        server = new apollo_server_1.ApolloServer({
            typeDefs: [organization_2.typeDefs, location_2.typeDefs, event_2.typeDefs],
            resolvers: [organization_1.resolvers, location_1.resolvers, event_1.resolvers, util_1.resolvers],
            dataSources
        });
    });
    afterAll(async () => {
    });
    it("Create an Organization", async () => {
        var _a;
        expect.assertions(2);
        const result = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Polus" }
        });
        expect(result.errors).toBe(undefined);
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.createOrganization.name).toBe("Polus");
    });
    it("Creates a Location", async () => {
        var _a;
        expect.assertions(2);
        const expectedResult = {
            name: "Polus Headquarters",
            address: "205 W 109th Street, New York, New York 100025",
            latitude: "40.802731",
            longitude: "-73.96481059999999",
            organizationId: "1",
        };
        const result = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Polus Headquarters",
                address: "205 W 109th Street, New York, New York 100025",
                organizationId: 1,
            }
        });
        expect(result.errors).toBe(undefined);
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.createLocation).toEqual(expectedResult);
    });
    it("Creates an Event", async () => {
        var _a;
        expect.assertions(2);
        const expectedResult = {
            name: "Party!",
            description: "A gathering of friends",
            organizationId: "1"
        };
        const eventResult = await server.executeOperation({
            query: Queries.CREATE_EVENT,
            variables: {
                name: "Party!",
                dateAndTime: new Date(),
                description: "A gathering of friends",
                organizationId: 1
            }
        });
        expect(eventResult.errors).toBe(undefined);
        expect((_a = eventResult.data) === null || _a === void 0 ? void 0 : _a.createEvent).toEqual(expectedResult);
    });
    it('Fetch Organization by Id', async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_ORGANIZATION,
            variables: { id: 1 }
        });
        expect(results.errors).toBe(undefined);
    });
    it('Fetch Location By Id', async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_LOCATION,
            variables: { id: 1 }
        });
        expect(results.errors).toBe(undefined);
    });
    it('Fetch Event By Id', async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_EVENT,
            variables: { id: 1 }
        });
        expect(results.errors).toBe(undefined);
    });
    it('Fetch Organizations by Ids', async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_ORGANIZATIONS,
            variables: { ids: [1] }
        });
        expect(results.errors).toBe(undefined);
    });
    it('Fetch Locations By Ids', async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_LOCATIONS,
            variables: { ids: [1] }
        });
        expect(results.errors).toBe(undefined);
    });
    it('Fetch Events By Ids', async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_EVENTS,
            variables: { ids: [1] }
        });
        expect(results.errors).toBe(undefined);
    });
    it('Fetch All Organizations', async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        expect(results.errors).toBe(undefined);
    });
    it("Fetch All Locations", async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_ALL_LOCATIONS
        });
        expect(results.errors).toBe(undefined);
    });
    it("Fetch All Events", async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_ALL_EVENTS
        });
        expect(results.errors).toBe(undefined);
    });
    it("Updates an Organization", async () => {
        var _a, _b;
        expect.assertions(2);
        console.log("Updating an Organization");
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS,
        });
        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_ORGANIZATION,
            variables: {
                id: parseInt((_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations[0].id),
                name: "Pola"
            }
        });
        expect(updateResult.errors).toBe(undefined);
        expect((_b = updateResult.data) === null || _b === void 0 ? void 0 : _b.updateOrganization.name).toBe("Pola");
    });
    it("Delete the first Organization", async () => {
        var _a, _b;
        expect.assertions(2);
        const expectedResult = {
            success: true
        };
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_ORGANIZATION,
            variables: { id: (_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations[0].id }
        });
        expect(deleteResult.errors).toBe(undefined);
        expect((_b = deleteResult.data) === null || _b === void 0 ? void 0 : _b.deleteOrganization).toEqual(expectedResult);
    });
});
