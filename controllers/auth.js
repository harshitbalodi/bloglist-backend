const AuthRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const passport = require("passport");
require("dotenv").config();

// Local authentication routes
AuthRouter.post("/login", async (request, response, next) => {
  try {
    const { username, password } = request.body;
    if (!username || !password) {
      return response
        .status(401)
        .send("Both password and username should be provided");
    }

    const user = await User.findOne({ username });

    if (!user) return response.status(401).send("Wrong username or password");

    const passwordCorrect = await bcrypt.compare(
      password,
      user?.hashedPassword
    );

    if (!passwordCorrect) {
      return response.status(401).send("Wrong username or password");
    }

    const accessToken = jwt.sign(
      { username, userId: user.id },
      process.env.SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      { username, userId: user.id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response
      .status(200)
      .send({ accessToken, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

AuthRouter.get("/refresh", async (request, response) => {
  const refreshToken = request.cookies?.refreshToken;
  console.log("cookie from request", request.cookies);
  if (!refreshToken) {
    return response
      .status(401)
      .json({ error: { message: "Refresh token is not provided" } });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (error, decoded) => {
    if (error) {
      return response.status(401).send("Refresh token is not valid");
    }

    const accessToken = jwt.sign(
      { username: decoded.username, userId: decoded.userId },
      process.env.SECRET,
      {
        expiresIn: "1d",
      }
    );
    console.log("Generated access token", accessToken);

    return response.json({
      accessToken,
      username: decoded.username,
    });
  });
});

// Google authentication routes
AuthRouter.get("/google", passport.authenticate("google", { scope: ["profile"] }));

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/logout" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URI}/?token=${req.user.accessToken}`);
  }
);

// Common logout route
AuthRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = AuthRouter;
