const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();
const { info } = require("../utils/loggers");
const crypto = require("crypto");


loginRouter.post("/", async (request, response, next) => {
  try {
    const { username, password } = request.body;
    if (!username || !password) {
      return response
        .status(401)
        .send("both password and username should be provided");
    }

    const user = await User.findOne({ username });

    if (!user) return response.status(401).send("wrong username or password");

    const passwordCorrect = await bcrypt.compare(
      password,
      user?.hashedPassword
    );

    if (!passwordCorrect) {
      return response.status(401).send("wrong username or password");
    }

    const accessToken = jwt.sign({ username, userId: user.id }, process.env.SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      { username, userId: user.id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    // info("refresh token", refreshToken);
    
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    response
      .status(200)
      .send({ accessToken, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

loginRouter.get('/refresh', async (request, response) => {
  const refreshToken = request.cookies.refreshToken;
  console.log("cookie from request",request.cookies);
  if(!refreshToken){
    return response.status(401).json({error:{message:'refresh token is not provided'}})
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (error, decoded) => {
    if(error){
      return response.status(401).send('refresh token is not valid');
    }

    const accessToken = jwt.sign({ username: decoded.username, userId: decoded.userId }, process.env.SECRET, {
      expiresIn: "1d",
    });

    response.json({
      accessToken
    });
  });
});

module.exports = loginRouter;
