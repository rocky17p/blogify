const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const { createTokenForUser } = require("../service/authentication");
router.get("/signin", (req, res) => {
  res.render("signin");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).render("signin", {
        error: "User not found!",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).render("signin", {
        error: "Incorrect Password!",
      });
    }

    const token = createTokenForUser(user);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).render("signin", {
      error: "Something went wrong! Please try again later.",
    });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});
module.exports = router;
