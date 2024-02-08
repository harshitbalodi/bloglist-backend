const testRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const {info} = require('../utils/loggers');

testRouter.post("/reset", async (request, response, next) => {
  try {
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log("Database resetted successfully!!!");
    return response.status(200).json({message:"Database resetted successfully!!!"});
  } catch (error) {
    info(error.message);
    next(error);
  }
});

module.exports = testRouter;
