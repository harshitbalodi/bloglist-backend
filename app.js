const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/user');
const authRouter = require('./controllers/auth');
const testRouter = require('./controllers/test');
const {MONGO_URI, TEST_MONGO_URI} = require('./utils/config');
const {info, error} = require('./utils/loggers');
const {unknownEndpoint, errorHandler, tokenExtracter, userExtracter} = require('./utils/middleware');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./utils/passport-config');
const friendsRouter = require('./controllers/friends');

require('dotenv').config();
require('express-async-errors');  

const url = process.env.NODE_ENV === "test"?TEST_MONGO_URI:MONGO_URI;

mongoose.connect(url).then(res=>{
    info("connection to database");
}).catch((err)=>{
    error(err);
})

app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://blog-repository-zeta.vercel.app'
    ],
    credentials: true
}))
app.use(cookieParser());
app.use(express.json())
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(tokenExtracter)

//test routes
if(process.env.NODE_ENV === 'test'){
    app.use('/api/test', testRouter);
}
//api Routes
app.use('/api/blogs',userExtracter, blogsRouter);
app.use('/api/users',usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/friends', userExtracter, friendsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;