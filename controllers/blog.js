const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { info } = require("../utils/loggers");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1,name:1});

  response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const resObject = request.body;
  

  if(!resObject.url || !resObject.title) {
    console.log(resObject);
    return response
      .status(400)
      .send({ error: "url or title is missing in the request object" });
  }
  
  const user = await User.findById(resObject.userId);
  
  delete resObject.userId;

  const blog = new Blog({
    ...resObject,
    user:user.id
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

module.exports = blogsRouter;
