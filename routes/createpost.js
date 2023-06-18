const express = require("express");
const app = express();
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");
const Post = require("../models/post");

router.get("/myfollowing", requireLogin, async (req, res) => {
  try {
    const postData = await Post.find({
      postedBy: {
        $in: req.user.following,
      },
    })
      .populate("postedBy", "_id name username Photo")
      .populate("comments.postedBy", "_id name username Photo")
      .sort("-createdAt");
    res.status(200).json({ posts: postData });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

router.delete("/deletepost/:postId", requireLogin, async (req, res) => {
  try {
    const userData = await Post.findOne({ _id: req.params.postId }).populate(
      "postedBy",
      "_id"
    );
    if (userData) {
      const currUserId = userData.postedBy._id.toString();
      const postUserId = req.user._id.toString();
      //  console.log(userData.postedBy._id.toString());
      //  console.log(req.user._id.toString());
      if (currUserId === postUserId) {
        await Post.findByIdAndDelete({ _id: req.params.postId });
        return res.status(200).json({ success: true });
      } else {
        return res.status(422).json({ error: "You didn't post that..." });
      }
    } else {
      return res.status(422).json({ error: "Something went wrong..." });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

router.put("/addcomment", requireLogin, async (req, res) => {
  try {
    const currComment = {
      comment: req.body.text,
      postedBy: req.user._id,
    };
    const commentData = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: currComment },
      },
      { new: true }
    ).populate("comments.postedBy", "_id username");
    res.status(200).json({ data: commentData });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

router.put("/like", requireLogin, async (req, res) => {
  try {
    const data = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    ).populate("postedBy", "_id name username");
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const data = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    ).populate("postedBy", "_id name username");
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

router.get("/myposts", requireLogin, async (req, res) => {
  try {
    //  console.log(req.user);
    const posts = await Post.find({ postedBy: req.user })
      .populate("postedBy", "_id username")
      .populate("comments.postedBy", "_id username")
      .sort("-createdAt");
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

router.get("/allposts", requireLogin, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("postedBy", "_id username Photo")
      .populate("comments.postedBy", "_id username Photo")
      .sort("-createdAt");
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

router.post("/createpost", requireLogin, async (req, res) => {
  // console.log("Hello Auth");

  const { body, photo } = req.body;
  // console.log(body);
  // console.log(photo);
  if (!body || !photo) {
    return res.status(422).json({ error: "Please add all the fields..." });
  }
  try {
    const post = new Post({
      body: body,
      photo: photo,
      postedBy: req.user,
    });
    await post.save();
    res.status(200).json({ success: true});
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
  // console.log(req.user);
});

module.exports = router;
