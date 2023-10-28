const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const mongoose_URL = process.env.mongoose_URL;
const secretKey = process.env.SECRET_KEY;

mongoose.connect(mongoose_URL).then(() => console.log("connected!"));

const userSchema = new mongoose.Schema({
  // userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPassword: { type: String, required: true },
});

const User = new mongoose.model("User", userSchema);

//Create User
// http://localhost:3000/user/signin
app.post("/user/signin", (req, res) => {
  console.log("some one try to sign in");
  const user = req.body;
  console.log(user);
  if (!user) {
    console.log("Request body is missing");
    return res.status(400).send({ message: "Request body is missing" });
  } else {
    User.findOne({ userEmail: user.userEmail })
      .exec()
      .then((result) => {
        if (result) {
          //   console.log(user);
          console.log("user allready Exist");
          res.send({ message: "user allready Exist" });
        } else {
          let newUser = new User(user);
          newUser.save();
          console.log("SignIn Successful");
          res.send({ message: "SignIn Successful" });
        }
        // Handle the found document in the result variable
      })
      .catch((error) => {
        // Handle any errors
        console.log("error", error);
        res.send("error", error);
      });
  }
});

//login User  && create a token
// http://localhost:3000/user/login
app.post("/user/login", verifyUser, (req, res) => {
  const user = req.body;
  jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
    res.json({
      token,
    });
  });
  console.log("token ganreted");
  // res.send({ message: "Login Successfull" });
});

function verifyUser(req, res, next) {
  console.log("try to login some one");
  const user = req.body;
  console.log(user);
  if (!user) {
    console.log("Request body is missing");
    return res.status(400).send({ message: "Request body is missing" });
  } else {
    User.findOne({ userEmail: user.userEmail })
      .exec()
      .then((result) => {
        if (!result) {
          console.log("No such user exist");
          return res.send({ message: "No such user exist" });
        } else {
          if (result.userPassword == user.userPassword) {
            next(); // Next middleware
          } else {
            console.log("Invalid Password");
            return res.send({ message: "Invalid Password" });
          }
        }
      })
      .catch((err) => console.log(err));
  }
}

// Verify the token
// goto http://localhost:3000/user
app.post("/user", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
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
console.log(PORT);
app.listen(4000);
