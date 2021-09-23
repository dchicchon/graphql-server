require("dotenv").config()
import { TypeDefs } from './schema/typeDefs'
import { Scalars } from './schema/scalars'
const { ApolloServer } = require("apollo-server")
// const typeDefs = require('./schema/typeDefs')
const resolvers = require('./schema/resolvers')
const { createStore } = require('./datasources/store')
const API = require("./datasources/api")
const store = createStore(); // startup the database
const dataSources = () => ({
    api: new API({ store })
})
const { defs } = TypeDefs;

const server = new ApolloServer({ defs, resolvers, dataSources, introspection: true })

server.listen().then((url: any) => {
    console.log("Server ready at", url)
})
