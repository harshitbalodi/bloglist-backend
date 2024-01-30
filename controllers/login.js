const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();
const {info} = require('../utils/loggers');

loginRouter.post('/', async ( request, response)=>{
    const {username, password} = request.body;
    
    const user = await User.findOne({username:username});
    info(user);

    const passwordCorrect = user === null?
    false:
    bcrypt.compare(password, user.passwordHash);
    
    if(!(user&& passwordCorrect)){
        return response.status(401).json({
            error:'invalid username or password'
        })
    }
    const token = jwt.sign(username, process.env.SECRET);
    
    response.status(200).send({token, username: user.username, name:user.name});
})

module.exports = loginRouter;