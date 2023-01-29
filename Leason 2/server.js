// required dependencies
var express = require("express");
var { graphqlHTTP } = require("express-graphql");
const schema = require("./graphQL/schema");

// app configuration
var app = express();

// create a GraphQL endpoint
app.use(
  "/",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

//listen app
app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
