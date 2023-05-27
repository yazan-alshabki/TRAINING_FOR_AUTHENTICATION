const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authmiddleware");
const app = express();

app.use(express.json());
app.use(cookieParser());
// middleware
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://yazan:yazan1234@database.pk2k6ll.mongodb.net/project";
let connectPort = async (port) => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true });
    app.listen(port);
    console.log("connect to database");
  } catch (err) {
    console.log(err);
  }
};
connectPort(3000);
app.get("*", checkUser);
// app.get("/set-cookies", (req, res) => {
//   res.cookie("newUser", false);
//   res.cookie("isEmploy", true, { maxAge: 1000 * 2 * 60 * 60, httpOnly: true });
//   res.send("you get the cookies");
// });
// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.newUser);
//   res.json(cookies);
// });

//routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
