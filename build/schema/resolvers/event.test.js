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
const Queries = __importStar(require("../testUtils/Queries"));
const organization_1 = require("./organization");
const location_1 = require("./location");
const event_1 = require("./event");
const util_1 = require("./util");
const organization_2 = require("../typeDefs/organization");
const location_2 = require("../typeDefs/location");
const event_2 = require("../typeDefs/event");
const api_1 = __importDefault(require("../../datasources/api"));
const store_1 = require("../../datasources/store");
const organization_3 = __importDefault(require("../../datasources/api/organization"));
const location_3 = __importDefault(require("../../datasources/api/location"));
const event_3 = __importDefault(require("../../datasources/api/event"));
const dotenv_1 = require("dotenv");
describe('All Resolvers', () => {
    let server;
    let organizationId;
    let eventId;
    beforeAll(async () => {
        var _a, _b;
        (0, dotenv_1.config)();
        const store = (0, store_1.createTestStore)();
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
        const createOrganizationResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Facebook" }
        });
        organizationId = (_a = createOrganizationResult.data) === null || _a === void 0 ? void 0 : _a.createOrganization.id;
        const createEventResult = await server.executeOperation({
            query: Queries.CREATE_EVENT,
            variables: {
                name: "Expunge User Data",
                description: "NSA is coming by soon. Delete everything!",
                dateAndTime: new Date('12/12/2021'),
                organizationId,
            }
        });
        eventId = (_b = createEventResult.data) === null || _b === void 0 ? void 0 : _b.createEvent.id;
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
                name: "Mark's Birthday",
                dateAndTime: new Date('12/22/2022'),
                description: "Mark is having people over his place for BBQ",
                organizationId,
            }
        });
        expect(eventResult.errors).toBe(undefined);
        expect((_b = eventResult.data) === null || _b === void 0 ? void 0 : _b.createEvent.name).toBe("Mark's Birthday");
    });
    it('Fetch Event By Id', async () => {
        var _a;
        expect.assertions(2);
        const results = await server.executeOperation({
            query: Queries.GET_EVENT,
            variables: { id: eventId }
        });
        expect(results.errors).toBe(undefined);
        expect((_a = results.data) === null || _a === void 0 ? void 0 : _a.event.name).toBe("Expunge User Data");
    });
    it('Fetch Events By Ids', async () => {
        expect.assertions(1);
        const results = await server.executeOperation({
            query: Queries.GET_EVENTS,
            variables: { ids: [1] }
        });
        expect(results.errors).toBe(undefined);
    });
    it("Fetch All Events", async () => {
        var _a;
        expect.assertions(2);
        const findResults = await server.executeOperation({
            query: Queries.GET_ALL_EVENTS
        });
        expect(findResults.errors).toBe(undefined);
        expect((_a = findResults.data) === null || _a === void 0 ? void 0 : _a.allEvents).toHaveLength(2);
    });
    it("Updates an Event", async () => {
        var _a;
        expect.assertions(2);
        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_EVENT,
            variables: {
                id: eventId,
                name: "Not Expunging Data",
                dateAndTime: new Date('12/18/2021'),
                description: "We're not expunging data! Just cleaning up house",
            }
        });
        expect(updateResult.errors).toBe(undefined);
        expect((_a = updateResult.data) === null || _a === void 0 ? void 0 : _a.updateEvent.name).toBe("Not Expunging Data");
    });
    it("Partially Updates an Event", async () => {
        var _a, _b;
        expect.assertions(4);
        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_EVENT,
            variables: {
                id: eventId,
                name: "Okay we're Expunging Data",
                description: "You caught us, we're deleting our data :(",
            }
        });
        const updateResult2 = await server.executeOperation({
            query: Queries.UPDATE_EVENT,
            variables: {
                id: eventId,
                name: "Expunge Data Party",
            }
        });
        expect(updateResult.errors).toBe(undefined);
        expect((_a = updateResult.data) === null || _a === void 0 ? void 0 : _a.updateEvent.name).toBe("Okay we're Expunging Data");
        expect(updateResult2.errors).toBe(undefined);
        expect((_b = updateResult2.data) === null || _b === void 0 ? void 0 : _b.updateEvent.name).toBe("Expunge Data Party");
    });
    it("Creates and Deletes an Event", async () => {
        var _a, _b;
        const expectedResult = {
            success: true
        };
        const createResult = await server.executeOperation({
            query: Queries.CREATE_EVENT,
            variables: {
                name: "Stockholder Meeting",
                dateAndTime: new Date('11/11/2021'),
                description: "Gathering all of the stockholders in order to talk about the company's future",
                organizationId,
            }
        });
        const eventId = (_a = createResult.data) === null || _a === void 0 ? void 0 : _a.createEvent.id;
        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_EVENT,
            variables: { id: eventId }
        });
        expect(createResult.errors).toBe(undefined);
        expect(deleteResult.errors).toBe(undefined);
        expect((_b = deleteResult.data) === null || _b === void 0 ? void 0 : _b.deleteEvent).toEqual(expectedResult);
    });
});
