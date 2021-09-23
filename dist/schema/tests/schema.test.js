"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs_1 = require("../typeDefs");
const resolvers_1 = require("../resolvers");
const graphql_tools_1 = require("graphql-tools");
const schema = (0, graphql_tools_1.makeExecutableSchema)({
    typeDefs: typeDefs_1.typeDefs,
    resolvers: resolvers_1.resolvers,
});
