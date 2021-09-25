import { ApolloServer } from 'apollo-server'
import { resolvers as organizationResolvers } from '../resolvers/organization'
import { resolvers as locationResolvers } from '../resolvers/location'
import { resolvers as eventResolvers } from '../resolvers/event'
import { resolvers as utilResolvers } from '../resolvers/util'
import { typeDefs as organizationDefs } from '../typeDefs/organization'
import { typeDefs as locationDefs } from '../typeDefs/location'
import { typeDefs as eventDefs } from '../typeDefs/event'
import API from '../../datasources/api'
import { createTestStore } from '../../datasources/store'
import Organization from '../../datasources/api/organization'
import Location from '../../datasources/api/location'
import Event from '../../datasources/api/event'
import { config } from 'dotenv'

export const createTestServer = async () => {
    config()
    const store = createTestStore()
    const organizationAPI = new Organization(store.organization)
    const locationAPI = new Location(store.location)
    const eventAPI = new Event(store.event)
    const dataSources = () => ({
        api: new API(organizationAPI, locationAPI, eventAPI)
    })
    const server: ApolloServer = new ApolloServer({
        typeDefs: [organizationDefs, locationDefs, eventDefs],
        resolvers: [organizationResolvers, locationResolvers, eventResolvers, utilResolvers],
        dataSources
    })
    return server
}