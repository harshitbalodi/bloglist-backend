const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();
const {info} = require('../utils/loggers');

loginRouter.post('/', async ( request, response)=>{
    const {username, password} = request.body;
    
    const user = await User.findOne({username:username});

    info("user",user);
    info("hashpassword:",user.hashedPassword);
    info("password in request body",password);

    const passwordCorrect = user === null?
    false:
    bcrypt.compare(password, user.hashedPassword);
    
    if(!(user&& passwordCorrect)){
        return response.status(401).json({
            error:'invalid username or password'
        })
    }
    
    const token = jwt.sign({username, userId:user.id}, process.env.SECRET);
    info("token",token)
    response.status(200).send({token, username: user.username, name:user.name});
})

module.exports = loginRouter;