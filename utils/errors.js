const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;
const defaultBadRequestMessage =
  "The request could not be understood due to incorrect syntax and need to be modified.";

class HTTPNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "HTTPNotFound";
    this.statusCode = 404;
  }
}

const defaultError = (res, err) => res.status(HTTP_INTERNAL_SERVER_ERROR).send({
    message: `An error has occurred on the server. Details are: ${err.message}`,
  });

const validateError = (res, err) => res.status(HTTP_BAD_REQUEST).send({
    message: `${defaultBadRequestMessage} Details are: ${err.message}`,
  });

const notFoundError = (res, err) => res.status(HTTP_NOT_FOUND).send({
    message: err.message,
  });

const invalidIdError = (res, entity, id) => res.status(HTTP_BAD_REQUEST).send({
    message: `Invalid ${entity} Id: ${id}.`,
  });

module.exports = {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTPNotFound,
  defaultError,
  validateError,
  notFoundError,
  invalidIdError,
};
