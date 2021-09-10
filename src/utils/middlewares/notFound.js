const notFoundErr = (req, res, next) => {
  res.status(404).render("error404");
};

module.exports = notFoundErr;
