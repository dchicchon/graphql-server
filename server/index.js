"use strict";
require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const { createStore } = require('./datasources/store');
const API = require("./datasources/api");
const store = createStore();
const dataSources = () => ({
    api: new API({ store })
});
const server = new ApolloServer({ typeDefs, resolvers, dataSources, introspection: true });
server.listen().then((url) => {
    console.log("Server ready at", url);
});
