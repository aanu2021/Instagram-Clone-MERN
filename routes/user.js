const express = require("express");
const router = express.Router();
const User = require("../models/model");
const Post = require("../models/post");
const requireLogin = require("../middlewares/requireLogin");

router.put("/uploadProfilePic", requireLogin, async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(req.user._id, {
      $set: { Photo: req.body.pic }
    }, {
      new: true
    });
    res.status(200).json({ success: true });
  }
  catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
})

// to follow a user
router.put("/follow", requireLogin, async (req, res) => {
  try {
    const to_follow = req.body.userID; // ayush
    const want_to_follow = req.user._id; // anumoy

    console.log(to_follow);
    console.log(want_to_follow);

    await User.findByIdAndUpdate(to_follow, {
      $addToSet: { followers: want_to_follow },
    });

    await User.findByIdAndUpdate(want_to_follow, {
      $addToSet: { following: to_follow },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

// to unfollow a user
router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    const to_follow = req.body.userID; // ayush
    const want_to_follow = req.user._id; // anumoy

    await User.findByIdAndUpdate(
      to_follow,
      {
        $pull: { followers: want_to_follow },
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      want_to_follow,
      {
        $pull: { following: to_follow },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const currUser = await User.findOne({ _id: id }).select("-password");
    const userPosts = await Post.find({ postedBy: id }).populate(
      "postedBy",
      "_id name username"
    );
    res.status(200).json({ user: currUser, posts: userPosts });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Something went wrong..." });
  }
});

module.exports = router;
