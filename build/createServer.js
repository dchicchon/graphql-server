"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const apollo_server_1 = require("apollo-server");
const organization_1 = require("./schema/typeDefs/organization");
const location_1 = require("./schema/typeDefs/location");
const event_1 = require("./schema/typeDefs/event");
const organization_2 = require("./schema/resolvers/organization");
const location_2 = require("./schema/resolvers/location");
const event_2 = require("./schema/resolvers/event");
const util_1 = require("./schema/resolvers/util");
const store_1 = require("./datasources/store");
const organization_3 = __importDefault(require("./datasources/api/organization"));
const location_3 = __importDefault(require("./datasources/api/location"));
const event_3 = __importDefault(require("./datasources/api/event"));
const api_1 = __importDefault(require("./datasources/api"));
const store = (0, store_1.createStore)();
const organizationAPI = new organization_3.default(store.organization);
const locationAPI = new location_3.default(store.location);
const eventAPI = new event_3.default(store.event);
const dataSources = () => ({
    api: new api_1.default(organizationAPI, locationAPI, eventAPI)
});
const createServer = () => {
    const server = new apollo_server_1.ApolloServer({
        typeDefs: [organization_1.typeDefs, location_1.typeDefs, event_1.typeDefs],
        resolvers: [organization_2.resolvers, location_2.resolvers, event_2.resolvers, util_1.resolvers],
        dataSources,
    });
    return server;
};
exports.createServer = createServer;
