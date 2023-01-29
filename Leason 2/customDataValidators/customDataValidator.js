// email validator function
const emailValidator = (value) => {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2[0-9]{1,3}))$/;
  if (value.match(regex)) {
    return value;
  } else {
    throw new GraphQLError("Email is not valid");
  }
};

// Password validator function
const passwordValidator = (value) => {
  const regex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (value.test(regex)) {
    return value;
  } else {
    throw new GraphQLError("Password must be at least 8 characters long");
  }
};

// Date validator function
const dateValidator = (value) => {
  const date = new Date(value);
  if (date.toDateString() === "Invalid Date") {
    throw new GraphQLError("Date is not valid");
  } else {
    return date.toISOString();
  }
};

// module exports
module.exports = {
  emailValidator,
  passwordValidator,
  dateValidator,
};
