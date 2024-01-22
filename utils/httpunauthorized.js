const { HTTP_UNAUTHORIZED } = require("./errors");

module.exports = class HTTPUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.name = "HTTPUnauthorized";
    this.statusCode = HTTP_UNAUTHORIZED;
  }
};
