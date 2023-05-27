const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: [true, "enter email in lowercase"],
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter an password"],
    minlength: [6, "password length must be at least 6 characters long"],
  },
});

// fire function before doc saved to db
userSchema.post("save", function (doc, next) {
  console.log("an email was created & saved ", doc);
  next();
});
userSchema.pre("save", async function (next) {
  let salt = await bcryptjs.genSalt();
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});
// static method to log in user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcryptjs.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("invalid password");
  }
  throw new Error("incorrect email");
};
const User = mongoose.model("user", userSchema);
module.exports = User;
