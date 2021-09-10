const handlerErrors = (err, req, res, next) => {
  if (err.name === "CastError") {
    res.status(400).json({
      error: "Malformatted id",
    });
  } else if (err.name === "ValidationError") {
    res.status(400).json({
      error: err.message,
    });
  } else if (err.name === "JsonWebTokenError") {
    req.flash("error", "Debe logearse para acceder");
    res.status(401).redirect("/admin");
  } else if (err.name === "TypeError") {
    res.status(500).json({ message: "internal error", err: err.message });
  }
  next(err);
};

module.exports = {
  handlerErrors,
};
