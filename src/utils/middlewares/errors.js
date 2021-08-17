const handlerErrors = (err, req, res, next) => {
  console.error(err.name);
  if (err.name === "CastError") {
    res.status(400).json({
      error: "Malformatted id",
    });
  } else if (err.name === "ValidationError") {
    res.status(400).json({
      error: err.message,
    });
  } else if (err.name === "JsonWebTokenError") {
    console.log(err.stack);
    res.status(401).json({
      error: "invalid token",
    });
  } else if (err.name === "TypeError") {
    console.log("err:::", err.message);
    console.log(err);
    res.status(500).json({ message: "internal error", err: err.message });
  }
  next(err);
};

module.exports = {
  handlerErrors,
};
