// dependencies
const { GraphQLSchema } = require("graphql");
const { RootQueryType, RootMutationType } = require("./types");

// graphql new GraphQLSchema
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
  //   subscription,
});

module.exports = schema;
