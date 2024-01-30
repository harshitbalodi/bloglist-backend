const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown Endpoint" });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  const statusCode = error.statusCode || 500;
  res
    .status(statusCode)
    .json({ error: { message: error.message || "Internal Server Error" } });
};

const tokenExtracter = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.authorization = authorization.replace("Bearer ", "");
  }
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtracter,
};
