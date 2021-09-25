import { GraphQLScalarType, Kind } from "graphql";

export module Scalars {
    export const dateScalar = new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        serialize(value: Date) {
            return value.getTime(); // Convert outgoing Date to integer for JSON
        },
        parseValue(value: Date) {
            return new Date(value); // Convert incoming integer to Date
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
            }
            return null; // Invalid hard-coded value (not an integer)
        },
    });
}