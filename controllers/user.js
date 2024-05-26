const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const multer = require("multer");
// const { info, error } = require("../utils/loggers");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  return response.status(200).send(users);
});

usersRouter.post("/",upload.single("image"), async (request, response) => {
  const { username, password, name } = request.body;
  const image = request.file.path;

  if (username === undefined || password === undefined) {
    return response.status(401).send("username and password are compulsory");
  }
  if (username && username.length <= 3) {
    return response
      .status(401)
      .send("username should be more then 3 characters");
  }

  if (password && password.length <= 3) {
    return response
      .status(401)
      .send("password should be more then 3 characters");
  }

  const userExist = await User.findOne({ username });

  if (userExist !== null)
    return response.status(409).send("username is already taken!");

  const saltRounds = 10;
  const newPassword = await bcrypt.hash(request.body.password, saltRounds);

  const user = new User({
    name,
    username,
    hashedPassword: newPassword,
    image
  });

  await user.save();
  const res = await User.findOne({ username: request.body.username });
  response.status(200).json(res);
});

module.exports = usersRouter;
