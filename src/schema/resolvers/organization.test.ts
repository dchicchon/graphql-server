import { ApolloServer } from 'apollo-server'
import * as Queries from '../testQueries'
import { resolvers as organizationResolvers } from './organization'
import { resolvers as locationResolvers } from './location'
import { resolvers as eventResolvers } from './event'
import { resolvers as utilResolvers } from './util'
import { typeDefs as organizationDefs } from '../typeDefs/organization'
import { typeDefs as locationDefs } from '../typeDefs/location'
import { typeDefs as eventDefs } from '../typeDefs/event'
import API from '../../datasources/api'
import createStore from '../../datasources/store'
import Organization from '../../datasources/api/organization'
import Location from '../../datasources/api/location'
import Event from '../../datasources/api/event'
import { config } from 'dotenv'


describe("Organization Resolvers", async () => {
    let server: ApolloServer;
    beforeAll(async () => {
        config()
        const store = createStore()
        const organizationAPI = new Organization(store.organization)
        // const locationAPI = new Location(store.location)
        // const eventAPI = new Event(store.event)
        const dataSources = () => ({
            api: new API(organizationAPI)
        })
        server = new ApolloServer({
            typeDefs: [organizationDefs, locationDefs, eventDefs],
            resolvers: [organizationResolvers, locationResolvers, eventResolvers, utilResolvers],
            dataSources
        })
        // maybe inject some data into the database beforehand and then delete afterwards
    })

})