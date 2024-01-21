const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;
const HTTP_INTERNAL_SERVER_ERROR = 500;
const defaultServerErrorMessage = "An error has occurred on the server.";
const defaultBadRequestMessage =
  "The request could not be understood due to incorrect syntax and need to be modified.";
const MONGODB_DUPLICATE_ERROR = 11000;

class HTTPNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "HTTPNotFound";
    this.statusCode = HTTP_NOT_FOUND;
  }
}

const defaultError = (res) =>
  res.status(HTTP_INTERNAL_SERVER_ERROR).send({
    message: `${defaultServerErrorMessage}`,
  });

const validateError = (res) =>
  res.status(HTTP_BAD_REQUEST).send({
    message: `${defaultBadRequestMessage}`,
  });

const notFoundError = (res, err) =>
  res.status(HTTP_NOT_FOUND).send({
    message: err.message,
  });

const forbiddenError = (res, err) =>
  res.status(HTTP_FORBIDDEN).send({
    message: err.message,
  });

const unauthorizedError = (res, err) =>
  res.status(HTTP_UNAUTHORIZED).send({
    message: err.message,
  });

const invalidIdError = (res, entity, id) =>
  res.status(HTTP_BAD_REQUEST).send({
    message: `Invalid ${entity} Id: ${id}.`,
  });

const dbDuplicateEmailError = (res, email) =>
  res.status(HTTP_CONFLICT).send({
    message: `e-mail ${email} is alredy exists.`,
  });

module.exports = {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_FORBIDDEN,
  HTTP_UNAUTHORIZED,
  HTTPNotFound,
  defaultError,
  validateError,
  notFoundError,
  forbiddenError,
  unauthorizedError,
  invalidIdError,
  MONGODB_DUPLICATE_ERROR,
  dbDuplicateEmailError,
};
