const {
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLError,
  Kind,
  GraphQLInputObjectType,
} = require("graphql");

const users = require("./../data/usersData");
const posts = require("./../data/postsData");
const {
  passwordValidator,
  emailValidator,
  dateValidator,
} = require("../customDataValidators/customDataValidator");

// gender Type Data
const GenderEnumType = new GraphQLEnumType({
  name: "GenderEnumType",
  description: "users gender",
  values: {
    male: {
      value: "male",
    },
    female: {
      value: "female",
    },
    other: {
      value: "other",
    },
  },
});

// Password Type Data
const PasswordType = new GraphQLScalarType({
  name: "PasswordType",
  description:
    "give a strong pass with 1 uppercase, 1 lowercase and 1 digit number",
  parseValue: passwordValidator,
  serialize: passwordValidator,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return passwordValidator(ast.value);
    } else {
      throw new GraphQLError("Password is not a string");
    }
  },
});

// EmailType Data
const EmailType = new GraphQLScalarType({
  name: "EmailType",
  description: "give a strong email",
  parseValue: emailValidator,
  serialize: emailValidator,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return emailValidator(ast.value);
    } else {
      throw new GraphQLError("Email is not a string");
    }
  },
});

// DateType Data
const DateType = new GraphQLScalarType({
  name: "DateType",
  description: "give a date",
  parseValue: dateValidator,
  serialize: dateValidator,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return dateValidator(ast.value);
    } else {
      throw new GraphQLError("Date is not a string");
    }
  },
});

// UserType Data
const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "User type",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(EmailType) },
    gender: { type: new GraphQLNonNull(GenderEnumType) },
    isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user) => {
        return posts.filter((post) => {
          if (user.posts.includes(post.id)) {
            return true;
          }
          return false;
        });
      },
    },
    createdAt: {
      type: DateType,
    },
    password: {
      type: new GraphQLNonNull(PasswordType),
    },
  }),
});

// UserInputType Data
const UserInputType = new GraphQLInputObjectType({
  name: "UserInputType",
  description: "User input type",
  fields: () => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: EmailType,
    },
    gender: {
      type: new GraphQLNonNull(GenderEnumType),
    },
    isActive: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    password: {
      type: PasswordType,
    },
    createdAt: {
      type: DateType,
    },
  }),
});

// UpdateUserInputType data
const UpdateUserInputType = new GraphQLInputObjectType({
  name: "UpdateUserInputType",
  description: "Update user input type",
  fields: () => ({
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    gender: {
      type: GenderEnumType,
    },
  }),
});

// PostType Data
const PostType = new GraphQLObjectType({
  name: "PostType",
  description: "Post type",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    userIds: {
      type: new GraphQLList(UserType),
      resolve: (post) => {
        return users.filter((user) => {
          if (post.userIds.includes(user.id)) {
            return true;
          } else {
            return false;
          }
        });
      },
    },
  }),
});

// RootQueryType graphql
const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root query type",
  fields: () => ({
    /* full users array */
    users: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: () => {
        return users;
      },
    },
    //get single user from users array
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, args) => {
        return users.find((user) => user.id == args.id);
      },
    },
    /* full posts array */
    posts: {
      type: new GraphQLList(PostType),
      resolve: () => {
        return posts;
      },
    },
    //get single post from posts array
    post: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, args) => {
        return posts.find((post) => post.id == args.id);
      },
    },
  }),
});

// RootMutationType graphql
const RootMutationType = new GraphQLObjectType({
  name: "RootMutationType",
  description: "Root mutation type",
  fields: () => ({
    /* create user */
    addUser: {
      type: UserType,
      args: {
        input: { type: UserInputType },
      },
      resolve: (_, { input: { firstName, lastName, gender, isActive } }) => {
        const user = {
          id: users.length + 1,
          firstName,
          lastName,
          // email,
          gender,
          isActive,
          // password,
          posts: [],
        };
        users.push(user);
        return user;
      },
    },
    /* update single user */
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        input: { type: UpdateUserInputType },
      },
      resolve: (
        _,
        { id, input: { firstName, lastName, gender, createdAt, password } }
      ) => {
        const user = users.find((user) => user.id == id);
        user.firstName = firstName;
        user.lastName = lastName;
        user.gender = gender;
        user.createdAt = createdAt;
        user.password = password;
        return user;
      },
    },
    /* delete single user */
    deleteUser: {
      type: GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => {
        const index = users.findIndex((user) => user.id == id);
        // if the user is already
        if (index > -1) {
          users.splice(index, 1);
          return true;
        }
        return false;
      },
    },
  }),
});

module.exports = { RootQueryType, RootMutationType };
