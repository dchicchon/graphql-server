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
describe("Organization Resolvers", () => {
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
    it("Create an Organization", async () => {
        var _a;
        expect.assertions(2);
        const result = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Amazon" }
        });
        expect(result.errors).toBe(undefined);
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.createOrganization.name).toBe("Amazon");
    });
    it('Creates and Fetches Organization by Id', async () => {
        var _a, _b;
        expect.assertions(3);
        const createResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Google" }
        });
        const organizationId = (_a = createResult.data) === null || _a === void 0 ? void 0 : _a.createOrganization.id;
        const findResult = await server.executeOperation({
            query: Queries.GET_ORGANIZATION,
            variables: { id: organizationId }
        });
        expect(createResult.errors).toBe(undefined);
        expect(findResult.errors).toBe(undefined);
        expect((_b = createResult.data) === null || _b === void 0 ? void 0 : _b.createOrganization.name).toBe("Google");
    });
    it('Fetch Organizations by Ids', async () => {
        var _a, _b;
        expect.assertions(2);
        const findAllResults = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        const orgIds = (_a = findAllResults.data) === null || _a === void 0 ? void 0 : _a.allOrganizations.map((org) => org.id);
        const findResults = await server.executeOperation({
            query: Queries.GET_ORGANIZATIONS,
            variables: { ids: orgIds }
        });
        expect(findResults.errors).toBe(undefined);
        expect((_b = findResults.data) === null || _b === void 0 ? void 0 : _b.organizations).toHaveLength(2);
    });
    it("Fetches All Organizations", async () => {
        var _a;
        expect.assertions(2);
        const findAllResults = await server.executeOperation({
            query: Queries.GET_ALL_ORGANIZATIONS
        });
        expect(findAllResults.errors).toBe(undefined);
        expect((_a = findAllResults.data) === null || _a === void 0 ? void 0 : _a.allOrganizations).toHaveLength(2);
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
                name: "Amazoo"
            }
        });
        const revertResult = await server.executeOperation({
            query: Queries.UPDATE_ORGANIZATION,
            variables: {
                id: organizationId,
                name: "Amazon"
            }
        });
        expect(updateResult.errors).toBe(undefined);
        expect((_b = findResult.data) === null || _b === void 0 ? void 0 : _b.allOrganizations[0].name).toBe("Amazon");
        expect((_c = updateResult.data) === null || _c === void 0 ? void 0 : _c.updateOrganization.name).toBe("Amazoo");
        expect((_d = revertResult.data) === null || _d === void 0 ? void 0 : _d.updateOrganization.name).toBe("Amazon");
    });
    it("Create and Deletes an organization", async () => {
        var _a, _b, _c;
        expect.assertions(4);
        const createResult = await server.executeOperation({
            query: Queries.CREATE_ORGANIZATION,
            variables: { name: "Twitter" }
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
        expect((_b = createResult.data) === null || _b === void 0 ? void 0 : _b.createOrganization.name).toBe("Twitter");
        expect(deleteResult.errors).toBe(undefined);
        expect((_c = deleteResult.data) === null || _c === void 0 ? void 0 : _c.deleteOrganization).toEqual(expectedResult);
    });
});
