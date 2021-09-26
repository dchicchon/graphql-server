import { ApolloServer } from "apollo-server"
import { typeDefs as organizationDefs } from './schema/typeDefs/organization'
import { typeDefs as locationDefs } from './schema/typeDefs/location'
import { typeDefs as eventDefs } from './schema/typeDefs/event'
import { resolvers as organizationResolvers } from './schema/resolvers/organization'
import { resolvers as locationResolvers } from './schema/resolvers/location'
import { resolvers as eventResolvers } from './schema/resolvers/event'
import { resolvers as utilResolvers } from './schema/resolvers/util'
import { createStore } from './datasources/store'
import { Store } from './interfaces/Types'
import Organization from './datasources/api/organization'
import Location from './datasources/api/location'
import Event from './datasources/api/event'
import API from './datasources/api'


const store: Store = createStore(); // startup the database

const organizationAPI = new Organization(store.organization)
const locationAPI = new Location(store.location)
const eventAPI = new Event(store.event)
const dataSources = () => ({
    api: new API(organizationAPI, locationAPI, eventAPI)
})

export const createServer = () => {
    const server = new ApolloServer({
        typeDefs: [organizationDefs, locationDefs, eventDefs],
        resolvers: [organizationResolvers, locationResolvers, eventResolvers, utilResolvers],
        dataSources,
        plugins: [
            // {

            //     // Plugin to check when server starts up
            //     async serverWillStart() {
            //         console.log("Server Starting Up")
            //     },

            //     // Plugin To check Requests to GraphQL server
            //     // use requestContext to access 
            //     async requestDidStart(requestContext) {
            //         console.log("Request Started")
            //         // console.log(requestContext)
            //         return {
            //             async parsingDidStart(requestContext) {
            //                 console.log("Parsing Started")
            //                 console.log(requestContext)
            //                 return async (err) => {
            //                     if (err) {
            //                         console.error(err)
            //                     }
            //                 }
            //             },
            //             async validationDidStart(requestContext) {
            //                 //This end hook is unique in that it can receive an array of errors,
            //                 // which will contain every validation error that occurred.
            //                 console.log("Validation started")
            //                 console.log(requestContext)
            //                 return async (errs) => {
            //                     if (errs) {
            //                         errs.forEach(err => console.error(err))
            //                     }
            //                 }
            //             },
            //             async executionDidStart() {
            //                 return {
            //                     async executationDidEnd(err) {
            //                         if (err) {
            //                             console.error(err)
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }

            // }
        ]

    })
    return server
}