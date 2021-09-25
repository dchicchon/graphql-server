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
describe('All Resolvers', () => {
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
        var _a;
        const result = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        for (const org of (_a = result.data) === null || _a === void 0 ? void 0 : _a.allOrganizations) {
            await server.executeOperation({
                query: Queries.DELETE_ORGANIZATION,
                variables: {
                    id: org.id
                }
            });
        }
        const result2 = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
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
        var _a, _b;
        expect.assertions(3);
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        const organizationId = (_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations[0].id;
        const createResult = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Polus Headquarters",
                address: "205 W 109th Street, New York, New York 100025",
                organizationId: organizationId,
            }
        });
        expect(findResult.errors).toBe(undefined);
        expect(createResult.errors).toBe(undefined);
        expect((_b = createResult.data) === null || _b === void 0 ? void 0 : _b.createLocation.name).toBe("Polus Headquarters");
    });
    it("Creates an Event", async () => {
        var _a, _b;
        expect.assertions(2);
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        const organizationId = (_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations[0].id;
        const eventResult = await server.executeOperation({
            query: Queries.CREATE_EVENT,
            variables: {
                name: "Party!",
                dateAndTime: new Date('10/12/2021'),
                description: "A gathering of friends",
                organizationId: organizationId,
            }
        });
        expect(eventResult.errors).toBe(undefined);
        expect((_b = eventResult.data) === null || _b === void 0 ? void 0 : _b.createEvent.name).toBe("Party!");
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
    it('Fetches Organizations by Id', async () => {
        var _a;
        expect.assertions(1);
        const findAllResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        const organizationIds = (_a = findAllResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations.map((organization) => organization.id);
        const findResults = await server.executeOperation({
            query: Queries.GET_ORGANIZATIONS,
            variables: { id: [organizationIds] }
        });
        expect(findResults.errors).toBe(undefined);
    });
    it('Fetch Locations By Ids', async () => {
        var _a;
        expect.assertions(1);
        const findAllResult = await server.executeOperation({
            query: Queries.GET_ALL_LOCATIONS
        });
        const locationIds = (_a = findAllResult.data) === null || _a === void 0 ? void 0 : _a.allLocations.map((location) => location.id);
        const findResults = await server.executeOperation({
            query: Queries.GET_LOCATIONS,
            variables: { ids: locationIds }
        });
        expect(findResults.errors).toBe(undefined);
    });
    it('Fetch Events By Ids', async () => {
        var _a;
        expect.assertions(1);
        const findAllResult = await server.executeOperation({
            query: Queries.GET_ALL_EVENTS
        });
        const eventIds = (_a = findAllResult.data) === null || _a === void 0 ? void 0 : _a.allEvents.map((event) => event.id);
        const findResults = await server.executeOperation({
            query: Queries.GET_EVENTS,
            variables: { ids: eventIds }
        });
        expect(findResults.errors).toBe(undefined);
    });
    it("Fetch All Locations", async () => {
        var _a;
        expect.assertions(2);
        const findResults = await server.executeOperation({
            query: Queries.GET_ALL_LOCATIONS
        });
        expect(findResults.errors).toBe(undefined);
        expect((_a = findResults.data) === null || _a === void 0 ? void 0 : _a.allLocations).toHaveLength(1);
    });
    it("Fetch All Events", async () => {
        var _a;
        expect.assertions(2);
        const findResults = await server.executeOperation({
            query: Queries.GET_ALL_EVENTS
        });
        expect(findResults.errors).toBe(undefined);
        expect((_a = findResults.data) === null || _a === void 0 ? void 0 : _a.allEvents).toHaveLength(1);
    });
    it("Updates an Organization", async () => {
        var _a, _b, _c, _d;
        expect.assertions(4);
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS,
        });
        const organizationId = (_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations[0].id;
        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_ORGANIZATION,
            variables: {
                id: organizationId,
                name: "Pola"
            }
        });
        const revertResult = await server.executeOperation({
            query: Queries.UPDATE_ORGANIZATION,
            variables: {
                id: organizationId,
                name: "Polus"
            }
        });
        expect(updateResult.errors).toBe(undefined);
        expect((_b = findResult.data) === null || _b === void 0 ? void 0 : _b.allOrganizations[0].name).toBe("Polus");
        expect((_c = updateResult.data) === null || _c === void 0 ? void 0 : _c.updateOrganization.name).toBe("Pola");
        expect((_d = revertResult.data) === null || _d === void 0 ? void 0 : _d.updateOrganization.name).toBe("Polus");
    });
    it("Updates a Location", async () => {
        var _a, _b, _c;
        expect.assertions(4);
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        const locationId = (_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations[0].locations[0].id;
        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_LOCATION,
            variables: {
                name: "Polus Resort",
                id: locationId,
            }
        });
        expect(findResult.errors).toBe(undefined);
        expect((_b = findResult.data) === null || _b === void 0 ? void 0 : _b.allOrganizations[0].locations[0].name).toBe("Polus Headquarters");
        expect(updateResult.errors).toBe(undefined);
        expect((_c = updateResult.data) === null || _c === void 0 ? void 0 : _c.updateLocation.name).toBe("Polus Resort");
    });
    it("Updates an Event", async () => {
        var _a, _b, _c;
        expect.assertions(4);
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        const eventId = (_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations[0].events[0].id;
        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_EVENT,
            variables: {
                id: eventId,
                name: "Birthday",
                dateAndTime: new Date('12/18/2021'),
                description: "It's my birthday!",
            }
        });
        expect(findResult.errors).toBe(undefined);
        expect((_b = findResult.data) === null || _b === void 0 ? void 0 : _b.allOrganizations[0].events[0].name).toBe("Party!");
        expect(updateResult.errors).toBe(undefined);
        expect((_c = updateResult.data) === null || _c === void 0 ? void 0 : _c.updateEvent.name).toBe("Birthday");
    });
    it("Create and Deletes an organization", async () => {
        var _a, _b, _c;
        expect.assertions(4);
        const createResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Google" }
        });
        const expectedResult = {
            success: true
        };
        const organizationId = (_a = createResult.data) === null || _a === void 0 ? void 0 : _a.createOrganization.id;
        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_ORGANIZATION,
            variables: { id: organizationId }
        });
        expect(createResult.errors).toBe(undefined);
        expect((_b = createResult.data) === null || _b === void 0 ? void 0 : _b.createOrganization.name).toBe("Google");
        expect(deleteResult.errors).toBe(undefined);
        expect((_c = deleteResult.data) === null || _c === void 0 ? void 0 : _c.deleteOrganization).toEqual(expectedResult);
    });
    it("Creates and Deletes a Location", async () => {
        var _a, _b, _c;
        expect.assertions(4);
        const expectedResult = {
            success: true
        };
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        const organizationId = (_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations[0].id;
        const createResult = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Company Island",
                address: "23 Happy Valley Rd, Pembroke, Bermuda",
                organizationId: organizationId,
            }
        });
        const locationId = (_b = createResult.data) === null || _b === void 0 ? void 0 : _b.createLocation.id;
        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_LOCATION,
            variables: { id: locationId }
        });
        expect(findResult.errors).toBe(undefined);
        expect(createResult.errors).toBe(undefined);
        expect(deleteResult.errors).toBe(undefined);
        expect((_c = deleteResult.data) === null || _c === void 0 ? void 0 : _c.deleteLocation).toEqual(expectedResult);
    });
    it("Creates and Deletes an Event", async () => {
        var _a, _b, _c;
        const expectedResult = {
            success: true
        };
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        const organizationId = (_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations[0].id;
        const createResult = await server.executeOperation({
            query: Queries.CREATE_EVENT,
            variables: {
                name: "Stockholder Meeting",
                dateAndTime: new Date('11/11/2021'),
                description: "Gathering all of the stockholders in order to talk about the company's future",
                organizationId: organizationId,
            }
        });
        const eventId = (_b = createResult.data) === null || _b === void 0 ? void 0 : _b.createEvent.id;
        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_EVENT,
            variables: { id: eventId }
        });
        expect(findResult.errors).toBe(undefined);
        expect(createResult.errors).toBe(undefined);
        expect(deleteResult.errors).toBe(undefined);
        expect((_c = deleteResult.data) === null || _c === void 0 ? void 0 : _c.deleteEvent).toEqual(expectedResult);
    });
});
