const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const mongoose_URL = process.env.mongoose_URL;
const PORT = process.env.PORT;
mongoose.connect(mongoose_URL).then(() => console.log("connected"));

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
});

const Post = new mongoose.model("Post", postSchema);

// acsses all post
// http://localhost:3000/posts
app.get("/posts", (req, res) => {
  Post.find()
    .then((result) => {
      if (!result) {
        res.send("no post found");
      } else {
        res.send(result);
      }
    })
    .catch((err) => console.log(err));
});

// create post
// http://localhost:3000/posts/create
app.post("/posts/create", (req, res) => {
  const post = req.body;
  console.log(post);
  if (!post) {
    return res
      .status(422)
      .json({ error: "you must provide a body to the request" });
  } else {
    // save it into database
    Post.findOne({ title: post.title }).then((result) => {
      if (!result) {
        const newPost = new Post(post);
        newPost
          .save()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => console.log(err));
      } else {
        return res.send("This title post already exist");
      }
    });
  }
});

// access post
app.get("/posts/:title", (req, res) => {
  let title = req.params.title;
  // find the post by title and send it back to client
  Post.findOne({ title: title })
    .then((result) => {
      if (!result) {
        res.send("no such post found");
      } else {
        res.send(result);
      }
    })
    .catch((err) => console.log(err));
});

app.listen(PORT);
