const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { info } = require("../utils/loggers");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {userExtracter} = require('../utils/middleware');

blogsRouter.get("/", async (request, response, next)  => {
  try{
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.status(200).json(blogs);
  }catch(error){
    next(error);
  }
  
});


blogsRouter.post("/",userExtracter, async (request, response, next) => {
  try{
  const resObject = request.body;
  if (!resObject.url || !resObject.title) {
    console.log(resObject);
    return response
      .status(400)
      .send({ error: "url or title is missing in the request object" });
  }
  
  info("user:", request.user);
  
  const user = await User.findById(request.user.userId);
  const blog = new Blog({
    ...resObject,
    user: user._id
  });

  
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  info(result);
  response.status(201).json(result);
}catch(error){
  next(error);
}
});

blogsRouter.delete("/:id", userExtracter, async (request, response, next) => {
  
  try {
    const id = request.params.id;

    const blog = await Blog.findById(new mongoose.Types.ObjectId(id));
    info("blog", blog);
    if (!blog) {
      return response.status(404).json({ error: "Blog is already deleted" });
    }

    const user = await User.findById(blog.user);
    info("user:", user);

    if (request.user.userId !== user.id) {
      return response
        .status(403)
        .json({ error: "not a valid user to perform this operation" });
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

blogsRouter.put('/:id', async(request, response, next)=>{
  try{
    const id = request.params.id;
    const updation = request.body;

    const res = await Blog.findByIdAndUpdate(id, updation);

    const blog =await  Blog.findById(id);
    response.status(200).send(blog);
  }catch(error){
    next(error);
  }
})

module.exports = blogsRouter;
