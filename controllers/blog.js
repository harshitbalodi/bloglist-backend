// controllers/blogs.js
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { info } = require("../utils/loggers");
const User = require("../models/user");
const mongoose = require("mongoose");
const { userExtracter } = require("../utils/middleware");

// get all the blogs
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

// get all the comment from the blog id 
blogsRouter.get("/:id/comments", async (request, response, next) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) return response.status(404).send("Not a valid blog ID");
    response.status(200).json(blog.comments);
  } catch (error) {
    next(error);
  }
});

// create a blog
blogsRouter.post("/", userExtracter, async (request, response, next) => {
  try {
    const resObject = request.body;
    if (!resObject.url || !resObject.title) {
      return response.status(400).send("URL or title is missing in the request object");
    }

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
    response.status(201).json(blogObj);
  } catch (error) {
    next(error);
  }
});

// comment in a blog
blogsRouter.post("/:id/comments", userExtracter, async (request, response, next) => {
  try {
    const { comment } = request.body;
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) return response.status(404).send("Invalid blog ID");
    blog.comments = blog.comments.concat(comment);
    await Blog.findByIdAndUpdate(id, blog);
    const newBlog = await Blog.findById(id);
    return response.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
});

// delete a blog
blogsRouter.delete("/:id", userExtracter, async (request, response, next) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(new mongoose.Types.ObjectId(id));
    if (!blog) {
      return response.status(404).send("Blog is already deleted");
    }

    const user = await User.findById(blog.user);
    if (request.user.userId !== user.id) {
      return response.status(403).send("Not a valid user to perform this operation");
    }

    user.blogs = user.blogs.filter((blogId) => blogId.toString() !== id);
    await user.save();
    await Blog.findByIdAndDelete(blog._id);
    response.status(204).send("Blog is deleted");
  } catch (error) {
    next(error);
  }
});

// like/unlike a blog
blogsRouter.put("/:id/like", userExtracter, async (request, response, next) => {
  try {
    const id = request.params.id;
    const userId = request.user.userId;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).send("Blog not found");
    }

    const alreadyLikedIndex = blog.likes.findIndex(like => like.toString() === userId);

    if (alreadyLikedIndex === -1) {
      blog.likes.push(userId);
    } else {
      blog.likes.splice(alreadyLikedIndex, 1);
    }

    const updatedBlog = await blog.save();
    response.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});


module.exports = blogsRouter;
