import { config } from 'dotenv'
import { ApolloServer } from 'apollo-server'
import { typeDefs as organizationDefs } from './schema/typeDefs/organization'
import { typeDefs as locationDefs } from './schema/typeDefs/location'
import { typeDefs as eventDefs } from './schema/typeDefs/event'
import { resolvers as organizationResolvers } from './schema/resolvers/organization'
import { resolvers as locationResolvers } from './schema/resolvers/location'
import { resolvers as eventResolvers } from './schema/resolvers/event'
import { resolvers as utilResolvers } from './schema/resolvers/util'
import { Store } from './interfaces/Types'
import createStore from './datasources/store'
import API from './datasources/api'
import Organization from './datasources/api/organization'
import Location from './datasources/api/location'
import Event from './datasources/api/event'
config()
const store: Store = createStore(); // startup the database
const organizationAPI = new Organization(store.organization)
const locationAPI = new Location(store.location)
const eventAPI = new Event(store.event)
const dataSources = () => ({
    api: new API(organizationAPI, locationAPI, eventAPI)
})

const server = new ApolloServer({
    typeDefs: [organizationDefs, locationDefs, eventDefs],
    resolvers: [organizationResolvers, locationResolvers, eventResolvers, utilResolvers],
    dataSources
})

server.listen().then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log("Server ready at", url)
})
