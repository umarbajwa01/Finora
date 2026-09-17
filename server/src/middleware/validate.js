const ApiError = require("../utils/ApiError");

// Wraps a Zod schema into Express middleware.
// Validates req.body (default) and replaces it with the parsed/typed data.
const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const messages = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    return next(new ApiError(400, "Validation failed.", messages));
  }
  req[source] = result.data;
  next();
};

module.exports = validate;
