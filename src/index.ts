import { config } from 'dotenv'
import { ApolloServer } from 'apollo-server'
import resolvers from './schema/resolvers'
import typeDefs from './schema/typeDefs'
import createStore from './datasources/store'
import API from './datasources/api'
import { Store } from './interfaces/Types'
config()
const store: Store = createStore(); // startup the database
const dataSources = () => ({
    api: new API(store)
})

const server = new ApolloServer({ typeDefs, resolvers, dataSources })

if (process.env.NODE_ENV !== 'test') {
    server.listen().then(({ url }) => {
        // eslint-disable-next-line no-console
        console.log("Server ready at", url)
    })
}

// export all the important pieces for integration/e2e tests to use