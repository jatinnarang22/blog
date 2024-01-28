const express = require("express");
const router = express.Router();
const Post = require("../Models/Post");
const User = require("../Models/User");
const { verifyToken } = require("../middleware/middleware");

router.get("/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(postId);
    const post = await Post.findById(postId);

    console.log(post, "jatin");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Extract post details including ID, title, and content
    const { _id, title, content } = post;
    console.log(_id, title, content);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/allPosts", (req, res) => {
  Post.find()
    .populate("postedBy", "name username")
    .select("_id photo title content")
    .then((posts) => {
      // console.log(posts);
      return res.json(posts);
    })
    .catch((err) => console.log(err));
});

router.post("/createPost", async (req, res) => {
  // console.log(verifyToken);
  const { content, title, url, id } = req.body;
  console.log(req.body);
  const { authorization } = req.headers;
  console.log(authorization);
  console.log(id);

  if (!authorization) {
    return res.status(401).json({ error: "You must have logged in 1" });
  }
  const cookies = authorization.replace("Bearer ", "");
  console.log(url);
  if (url === "" || url === undefined) {
    return res.status(401).json({ error: "You must have logged in 2" });
  }
  const post = new Post({
    content,
    title,
    photo: url,
    postedBy: id,
    // postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      return res.json({ post: result });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
