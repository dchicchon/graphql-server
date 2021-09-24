"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const apollo_server_1 = require("apollo-server");
const resolvers_1 = __importDefault(require("./schema/resolvers"));
const typeDefs_1 = __importDefault(require("./schema/typeDefs"));
const store_1 = __importDefault(require("./datasources/store"));
const api_1 = __importDefault(require("./datasources/api"));
(0, dotenv_1.config)();
const store = (0, store_1.default)();
const dataSources = () => ({
    api: new api_1.default(store)
});
const server = new apollo_server_1.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default, dataSources });
if (process.env.NODE_ENV !== 'test') {
    server.listen().then(({ url }) => {
        console.log("Server ready at", url);
    });
}
