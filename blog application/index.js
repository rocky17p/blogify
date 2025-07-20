const express = require("express");
const cookieparser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const {
  checkforauthenticationCookie,
} = require("./middlewares/authentication");
const app = express();
const port = 8000;
mongoose.connect("mongodb://localhost:27017/blogify").then((e) => {
  console.log("mongo db connected");
});
const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(checkforauthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.listen(port, () => {
  console.log("server connected");
});
