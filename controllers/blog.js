const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { info } = require("../utils/loggers");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { userExtracter } = require("../utils/middleware");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });

    response.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:id/comments", async (request, response, next) => {
  try {
    const id = request.params.id;
    console.log(id);
    const blog = await Blog.findById(id);
    console.log("This is blog", blog);
    if (!blog) return response.status(404).send("not a valid blog id");
    response.status(200).json(blog.comments);
  } catch (error) {
    console.log("error inside get comments", error);
    next(error);
  }
});

blogsRouter.post("/", userExtracter, async (request, response, next) => {
  try {
    const resObject = request.body;
    if (!resObject.url || !resObject.title) {
      console.log(resObject);
      return response
        .status(400)
        .send("url or title is missing in the request object");
    }

    info("user:", request.user);

    const user = await User.findById(request.user.userId);
    const blog = new Blog({
      ...resObject,
      user: user._id,
    });

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    const blogObj = await Blog.findById(result._id).populate("user", {
      username: 1,
      name: 1,
    });
    info("Blog object", blogObj);
    response.status(201).json(blogObj);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post(
  "/:id/comments",
  userExtracter,
  async (request, response, next) => {
    try {
      console.log(request.body);
      const { comment } = request.body;
      const id = request.params.id;
      const blog = await Blog.findById(id);
      if (!blog) return response.status(404).send("invalid blog id");
      blog.comments = blog.comments.concat(comment);
      await Blog.findByIdAndUpdate(id,blog);
      const newBlog =await Blog.findById(id);
      console.log(newBlog);
      return response.status(201).json(newBlog);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

blogsRouter.delete("/:id", userExtracter, async (request, response, next) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(new mongoose.Types.ObjectId(id));
    info("blog", blog);
    if (!blog) {
      return response.status(404).send("Blog is already deleted");
    }

    const user = await User.findById(blog.user);
    info("user:", user);

    if (request.user.userId !== user.id) {
      return response
        .status(403)
        .send("not a valid user to perform this operation");
    }

    user.blogs = user.blogs.filter((blogId) => blogId.toString() !== id);
    info("user.blog", user.blogs);
    const ressave = await user.save();
    info("res-save:", ressave);
    const res = await Blog.findByIdAndDelete(blog._id);
    info("res from delete operartion:", res);
    response.status(204).send("blog is deleted");
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(id).populate("user", {
      username: 1,
      name: 1,
    });
    blog.likes = blog.likes + 1;
    await blog.save();

    response.status(200).send(blog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
