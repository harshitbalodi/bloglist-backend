const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { info, error } = require("../utils/loggers");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('blogs',{url:1, title:1, author:1});
  return response.status(200).send(users);
});

usersRouter.post("/", async (request, response) => {
  if (
    request.body.username === undefined ||
    request.body.password === undefined
  ) {
    return response
      .status(401)
      .json({ error: { message: "username and password are compulsory" } });
  }
  if (request.body.username && request.body.username.length <= 3) {
    return response
      .status(401)
      .json({
        error: { message: "username should be more then 3 characters" },
      });
  }

  if (request.body.password && request.body.password.length <= 3) {
    return response
      .status(401)
      .json({
        error: { message: "password should be more then 3 characters" },
      });
  }
  const username = request.body.username;
  const userExist = await User.findOne({username});

  if (userExist !== null)
    return response.status(409).json({ error: "username is already taken!" });

  const saltRounds = 10;
  const newPassword = await bcrypt.hash(request.body.password, saltRounds);

  const user = new User({
    name: request.body.name,
    username: request.body.username,
    hashedPassword: newPassword,
  });

  await user.save();
  const res = await User.findOne({ username: request.body.username });
  response.status(200).json(res);
});

module.exports = usersRouter;
