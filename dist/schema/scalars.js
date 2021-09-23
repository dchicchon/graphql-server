"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scalars = void 0;
const graphql_1 = require("graphql");
var Scalars;
(function (Scalars) {
    Scalars.dateScalar = new graphql_1.GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        serialize(value) {
            return value.getTime();
        },
        parseValue(value) {
            return new Date(value);
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.INT) {
                return new Date(parseInt(ast.value, 10));
            }
            return null;
        },
    });
})(Scalars = exports.Scalars || (exports.Scalars = {}));
