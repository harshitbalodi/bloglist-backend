const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const testRouter = require('./controllers/test');
const {MONGO_URI, TEST_MONGO_URI} = require('./utils/config');
const {info, error} = require('./utils/loggers');
const {unknownEndpoint, errorHandler, tokenExtracter, userExtracter} = require('./utils/middleware');
const cookieParser = require('cookie-parser');

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
app.use(tokenExtracter)

if(process.env.NODE_ENV === 'test'){
    app.use('/api/test', testRouter);
}
//api Routes
app.use('/api/blogs',userExtracter, blogsRouter);
app.use('/api/users',usersRouter);
app.use('/api/login' , loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;