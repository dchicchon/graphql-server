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
describe('resolvers', () => {
    let server;
    let organizationId;
    let locationId;
    beforeAll(async () => {
        var _a, _b;
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
        const createOrganizationResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Twitter" }
        });
        organizationId = (_a = createOrganizationResult.data) === null || _a === void 0 ? void 0 : _a.createOrganization.id;
        const createLocationResult = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Twitter SF Headquarters",
                address: "1355 Market St #900, San Francisco, CA 94103",
                organizationId: organizationId,
            }
        });
        locationId = (_b = createLocationResult.data) === null || _b === void 0 ? void 0 : _b.createLocation.id;
    });
    afterAll(async () => {
        var _a;
        const findResult = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        for (const org of (_a = findResult.data) === null || _a === void 0 ? void 0 : _a.allOrganizations) {
            const organizationId = org.id;
            const deleteResult = await server.executeOperation({
                query: Queries.DELETE_ORGANIZATION,
                variables: { id: organizationId }
            });
        }
    });
    it("Creates a Location", async () => {
        var _a;
        expect.assertions(2);
        const createResult = await server.executeOperation({
            query: Queries.CREATE_LOCATION,
            variables: {
                name: "Twitter NYC Headquarters",
                address: "245 W 17th St, New York, NY 11238",
                organizationId,
            }
        });
        expect(createResult.errors).toBe(undefined);
        expect((_a = createResult.data) === null || _a === void 0 ? void 0 : _a.createLocation.name).toBe("Twitter NYC Headquarters");
    });
    it('Fetch Location By Id', async () => {
        var _a;
        expect.assertions(2);
        const findResult = await server.executeOperation({
            query: Queries.GET_LOCATION,
            variables: { id: locationId }
        });
        expect(findResult.errors).toBe(undefined);
        expect((_a = findResult.data) === null || _a === void 0 ? void 0 : _a.location.name).toBe("Twitter SF Headquarters");
    });
    it('Fetch Locations By Ids', async () => {
        var _a, _b;
        expect.assertions(2);
        const findAllResults = await server.executeOperation({
            query: Queries.GET_ALL_LOCATIONS
        });
        const locationIds = (_a = findAllResults.data) === null || _a === void 0 ? void 0 : _a.allLocations.map((location) => location.id);
        const results = await server.executeOperation({
            query: Queries.GET_LOCATIONS,
            variables: { ids: locationIds }
        });
        expect(results.errors).toBe(undefined);
        expect((_b = results.data) === null || _b === void 0 ? void 0 : _b.locations).toHaveLength(2);
    });
    it("Fetch All Locations", async () => {
        var _a;
        expect.assertions(2);
        const findResults = await server.executeOperation({
            query: Queries.GET_ALL_LOCATIONS
        });
        expect(findResults.errors).toBe(undefined);
        expect((_a = findResults.data) === null || _a === void 0 ? void 0 : _a.allLocations).toHaveLength(2);
    });
    it("Updates a Location", async () => {
        var _a;
        expect.assertions(2);
        const updateResult = await server.executeOperation({
            query: Queries.UPDATE_LOCATION,
            variables: {
                name: "Twitter Resort",
                id: locationId,
            }
        });
        expect(updateResult.errors).toBe(undefined);
        expect((_a = updateResult.data) === null || _a === void 0 ? void 0 : _a.updateLocation.name).toBe("Twitter Resort");
    });
    it("Creates and Deletes a Location", async () => {
        var _a;
        expect.assertions(2);
        const expectedResult = {
            success: true
        };
        const deleteResult = await server.executeOperation({
            query: Queries.DELETE_LOCATION,
            variables: { id: locationId }
        });
        expect(deleteResult.errors).toBe(undefined);
        expect((_a = deleteResult.data) === null || _a === void 0 ? void 0 : _a.deleteLocation).toEqual(expectedResult);
    });
});
