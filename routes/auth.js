require("dotenv").config();
const express = require("express");
const app = express();
const User = require("../models/model");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middlewares/requireLogin");
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());

router.post(
  "/signup",
  [
    body("email", "Email is not properly formatted").isEmail(),
    body("username", "Username is too short").isLength({ min: 5 }),
    body("password", "Password is too short, choose something strong").isLength(
      { min: 5 }
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(432).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(422).json({ error: "Please add all the fields..." });
    }
    try {
      const savedUser = await User.findOne({
        $or: [{ email: email }, { username: username }],
      });
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "A user already exist with the email or username" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
          name: name,
          username: username,
          email: email,
          password: hashedPassword,
        });
        await user.save();
        res.status(200).json({ success: true });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Email is not properly formatted").isEmail(),
    body("password", "Password is too short, choose something strong").isLength(
      { min: 5 }
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(432).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "Please add all the fields..." });
    }
    try {
      const userData = await User.findOne({ email: email });
      if (userData) {
        const hashedPassword = userData.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (isMatch) {
          const jwtToken = jwt.sign({ _id: userData.id }, SECRET_KEY);
          return res
            .status(200)
            .json({
              success: true,
              username: userData.username,
              token: jwtToken,
              user: userData,
            });
        } else {
          return res
            .status(422)
            .json({
              error:
                "Your entered password is not matched, please try again...",
            });
        }
      } else {
        return res
          .status(422)
          .json({ error: "No user exists with this email..." });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false });
    }
  }
);

module.exports = router;
