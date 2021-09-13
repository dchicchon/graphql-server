require("dotenv").config()
const { ApolloServer } = require("apollo-server")
const typeDefs = require('./schema/typeDefs')
const resolvers = require('./schema/resolvers')
const { createStore } = require('./datasources/store')
const API = require("./datasources/api")
const store = createStore();
const dataSources = () => ({
    api: new API({ store })
})

const server = new ApolloServer({ typeDefs, resolvers, dataSources, introspection: true })

/*
TODO: Find out how Apollo and GraphQL work together here
1. Define ApolloServer
2. Define typeDef
3. Define resolver
4. Define dataSources
*/
 

/*
TODO: Tasks
1. Be able to get all locations and events belonging to an organization
2. Be able to query an event or a location and find out which organization it belongs to
*/

server.listen().then(({ url }) => {
    console.log("Server ready at", url)
})