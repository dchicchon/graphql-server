import { Scalars } from '../scalars'


export const resolvers = {
    // DataObject: {
    //   __anyresolveType(obj: DatabaseObject) {
    //     if (obj.description) return 'Event'
    //     if (obj.latitude) return 'Location'
    //     if (obj.name) return 'Organization'
    //     if (obj.message) return 'ErrorObject'
    //     return null // returns graphql error
    //   }
    // },
    Date: Scalars.dateScalar,
}