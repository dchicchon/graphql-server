const { dateScalar } = require('./scalars')


// Resolver Function Parameters: parent, args, context, info
const resolvers = {
    Query: {
        organization: async (_, { id }, { dataSources }) => dataSources.api.getOrganization({ id }),
        location: async (_, { id }, { dataSources }) => dataSources.api.getLocation({ id }),
        event: async (_, { id }, { dataSources }) => dataSources.api.getEvent({ id }),
        organizations: async (_, __, { dataSources }) => dataSources.api.getAllOrganizations(),
        locations: async (_, __, { dataSources }) => dataSources.api.getAllLocations(),
        events: async (_, __, { dataSources }) => dataSources.api.getAllEvents()
    },
    Mutation: {
        createOrganization: async (_, { name }, { dataSources }) => {
            // console.log("\nResolver")
            // console.log(_)
            // console.log(name)
            // console.log(dataSources)
            const results = await dataSources.api.createOrganization({ name })
            // console.log("Resolve Results:")
            // console.log(results)
            return {
                success: results.length === 1,
                message: "Successfully created an organization"
            }
        },
        createLocation: async (_, { name, address, latitude, longitude, organizationId }, { dataSources }) => {
            const results = await dataSources.api.createLocation({ name, address, latitude, longitude, organizationId })
            console.log("Resolver")
            console.log(results)
            return {
                success: results.length === 1,
                message: "Successfully created a Location"

            }
        },
        createEvent: async (_, { name, dateAndTime, description, organizationId }, { dataSources }) => {
            const results = await dataSources.api.createEvent({ name, dateAndTime, description, organizationId })
            console.log("Resolver")
            console.log(results)
            return {
                success: results.length === 1,
                message: "Successfully created an Event"
            }
        },

        updateOrganization: async ({ id }) => dataSources.api.updateOrganization({ id }),
        updateLocation: async ({ id }) => dataSources.api.updateLocation({ id }),
        updateEvent: async ({ id }) => dataSources.api.updateEvent({ id }),

        deleteOrganization: async ({ id }) => dataSources.api.deleteOrganization({ id }),
        deleteLocation: async ({ id }) => dataSources.api.deleteLocation({ id }),
        deleteEvent: async ({ id }) => dataSources.api.deleteEvent({ id }),
    },
    Date: dateScalar
}

module.exports = resolvers