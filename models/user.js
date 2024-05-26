const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
username: {
    minLength:3,
    type: String,
    required: true,
    unique:true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  }
  ,
  blogs:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    }
  ],
  friends:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;