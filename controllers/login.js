const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();
const { info } = require("../utils/loggers");

loginRouter.post("/", async (request, response, next) => {
  try {
    const { username, password } = request.body;
    info("username:", username);
    info("password:", password);
    if (!username || !password){
      return response
        .status(401)
        .send("both password and username should be provided");
    }

    const user = await User.findOne({ username });

    info("user", user);
    info("hashpassword:", user.hashedPassword);
    info("password in request body", password);

    if (!user)
      return response.status(401).send("wrong username or password");

    const passwordCorrect = await bcrypt.compare(password, user?.hashedPassword);

    if (!passwordCorrect) {
      return response.status(401).send("wrong username or password");
    }

    const token = jwt.sign({ username, userId: user.id }, process.env.SECRET);
    info("token", token);
    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
