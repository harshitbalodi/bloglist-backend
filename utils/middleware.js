const jwt = require('jsonwebtoken');
const {info} = require('./loggers');
const path = require('path');
const fs = require('fs');

const unknownEndpoint = (req, res) => {
  res.status(404);
  const htmlFile = 'index.html';
  const filePath = path.join(__dirname, '../public',htmlFile);
  fs.access(filePath, fs.constants.F_OK, err=>{
    if(err){
      console.log('Error accessing requested HTML file:',err);
      return res.send({error:'unknown endpoint'});
    }
    fs.readFile(filePath, 'utf-8', (err, data)=>{
      if(err){
        console.log('Error reading HTML file:',err);
        return res.send({error:'unknown endpoint'});
      }
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    })
  })
};

const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  const statusCode = error.statusCode || 500;
  res
    .status(statusCode)
    .json({ error: { message: error.message || "Internal Server Error" } });
};

const tokenExtracter = (request, response, next) => {
  const authorization = request.get("Authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.Authorization = authorization.replace("Bearer ", "");
  }else{
    request.Authorization = null;
  }
  next();
};

const userExtracter = (request, response, next) => {
  const token = request.Authorization;

  if (token === null) {
    if(request.method === 'GET' )  return next();
    return response.status(401).json({error:"token is not provided with the request"})
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    info(decodedToken);
    if (!decodedToken.username || !decodedToken.userId) {
      return response.status(401).json({error:"Invalid Token!"})
    }
    request.user  = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtracter,
  userExtracter
};
