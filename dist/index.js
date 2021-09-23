"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const apollo_server_1 = require("apollo-server");
const resolvers_1 = require("./schema/resolvers");
const typeDefs_1 = require("./schema/typeDefs");
const store_1 = require("./datasources/store");
const api_1 = require("./datasources/api");
(0, dotenv_1.config)();
const store = (0, store_1.createStore)();
const dataSources = () => ({
    api: new api_1.API(store)
});
const server = new apollo_server_1.ApolloServer({ typeDefs: typeDefs_1.typeDefs, resolvers: resolvers_1.resolvers, dataSources, introspection: true });
server.listen().then(({ url }) => {
    console.log("Server ready at", url);
});
