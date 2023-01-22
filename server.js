/* dependencies */
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  //   RootQueryType,
} = require("graphql");
const users = require("./usersData");

/* initialize app */
const app = express();
const port = 3000;

/* user data type */
const usersDataType = new GraphQLObjectType({
  name: "Users",
  description: "Users List With Nested Data Formate.",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    // address: {
    //   type: new GraphQLList(userAddressType),
    // },
    // address: () => {
    //   return new GraphQLObjectType(userAddressType);
    // },
    phone: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

/* user address data type */
const userAddressType = new GraphQLObjectType({
  name: "address",
  description: "User's address",
  fields: () => ({
    street: {
      type: new GraphQLNonNull(GraphQLString),
    },
    suite: {
      type: new GraphQLNonNull(GraphQLString),
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
    },
    zipcode: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

/* RootQueryType types */
const RootQueryType = new GraphQLObjectType({
  name: "UserData",
  description: "nested user data",
  fields: () => ({
    users: {
      type: new GraphQLList(usersDataType),
      resolve: () => {
        return users;
      },
    },
  }),
});

/* Root Schema */
const usersSchema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/",
  graphqlHTTP({
    schema: usersSchema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`server is running @${port}`);
});
