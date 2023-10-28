var express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var app = express();
const secrtKey = "anSecrtKey";
app.use(express.json()); // *************** //
mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => console.log("Connected!"));
const user = {
  username: "Raju",
  profesion: "Halwai",
  email: "webanilsidhu@gmail.com",
  age: 43,
  weight: 97,
};

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    require: true,
  },
  userEmail: {
    type: String,
    require: true,
  },
  userPassword: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});
const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  return res.send(user);
});

// goto http://localhost:3000/profile/your_name
app.get("/profile/:id", function (req, res) {
  res.send("This is " + req.params.id + "'s profile");
});

// const Mage = new mongoose.model("Mage", mageSchema);

// const mage_1 = new Mage({
//   name: "Takashi",
//   power_type: "Element",
//   mana_power: 200,
//   health: 1000,
//   gold: 10000,
// });

// mage_1.save();
// resister user or create user
// goto http://localhost:3000/api/signin
app.post("/api/signin", (req, res) => {
  // console.log(req);
  const { id, password } = req.body;
  console.log(id);
  console.log(password);
  const user = createUser(req.body);
  return res.send(user);
});
function createUser(data) {
  console.log(data);
  const user = User.find({ userEmail: data.email });
  if (!user) {
    return res.send("User allready exist");
  }
  const newUser = new User({
    userID: data.id,
    userEmail: data.email,
    userPassword: data.password,
  });
  newUser.save((err, savedBook) => {
    if (err) {
      console.error("Error saving the book:", err);
    } else {
      console.log("Book saved:", savedBook);
    }
  });
  // User.save(newUser);
  return data;
  return "User Created";
}
// Generate token
// goto http://localhost:3000/api/login
app.post("/api/login", (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: "anil",
    email: "webanilsidhu@gmail.com",
  };
  const userData = req.body;

  jwt.sign({ user }, "secretkey", { expiresIn: "300s" }, (err, token) => {
    res.json({
      token,
    });
  });
});

// Verify the token
// goto http://localhost:3000/api/posts
app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.send({ result: "no login" });
    } else {
      res.json({
        message: "Post created...",
        authData,
      });
    }
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
// Verify Token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"]; // Get auth header value
  // console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    // Check if bearer is undefined
    const bearer = bearerHeader.split(" "); // Split at the space
    const bearerToken = bearer[1]; // Get token from array
    req.token = bearerToken; // Set the token
    next(); // Next middleware
  } else {
    res.send({ result: "no login" }); // Forbidden
  }
}

app.post("/json-data", (req, res) => {
  const jsonData = req.body; // Access JSON data from the request body
  console.log(jsonData);
  res.json(jsonData);
});
app.listen(3001);
