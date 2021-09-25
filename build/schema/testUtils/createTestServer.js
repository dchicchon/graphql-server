"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestServer = void 0;
const apollo_server_1 = require("apollo-server");
const organization_1 = require("../resolvers/organization");
const location_1 = require("../resolvers/location");
const event_1 = require("../resolvers/event");
const util_1 = require("../resolvers/util");
const organization_2 = require("../typeDefs/organization");
const location_2 = require("../typeDefs/location");
const event_2 = require("../typeDefs/event");
const api_1 = __importDefault(require("../../datasources/api"));
const store_1 = require("../../datasources/store");
const organization_3 = __importDefault(require("../../datasources/api/organization"));
const location_3 = __importDefault(require("../../datasources/api/location"));
const event_3 = __importDefault(require("../../datasources/api/event"));
const dotenv_1 = require("dotenv");
const createTestServer = async () => {
    (0, dotenv_1.config)();
    const store = (0, store_1.createTestStore)();
    const organizationAPI = new organization_3.default(store.organization);
    const locationAPI = new location_3.default(store.location);
    const eventAPI = new event_3.default(store.event);
    const dataSources = () => ({
        api: new api_1.default(organizationAPI, locationAPI, eventAPI)
    });
    const server = new apollo_server_1.ApolloServer({
        typeDefs: [organization_2.typeDefs, location_2.typeDefs, event_2.typeDefs],
        resolvers: [organization_1.resolvers, location_1.resolvers, event_1.resolvers, util_1.resolvers],
        dataSources
    });
    return server;
};
exports.createTestServer = createTestServer;
