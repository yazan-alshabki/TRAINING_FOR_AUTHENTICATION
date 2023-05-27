const User = require("../modules/user");

const jwt = require("jsonwebtoken");
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge,
  });
};
const errorHandler = (err) => {
  let error = { email: "", password: "" };
  if (err.message === "invalid password") {
    error.password = "that password is incorrect";
  }
  if (err.message === "incorrect email") {
    error.email = "that email is not registered";
  }
  if (err.code === 11000) {
    error.email = "that email is already registered";
    return error;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
    console.log(user.email, user.password);
  } catch (err) {
    const error = errorHandler(err);
    res.status(400).json({ error });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const error = errorHandler(err);
    res.status(400).json({ error });
  }
};
module.exports.logout_get = (req ,res) => {
    res.cookie('jwt' ,'' ,{maxAge: 1});
    res.redirect('/');
}
