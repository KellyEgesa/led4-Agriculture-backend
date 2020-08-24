module.exports = function (req, res, next) {
  if (!req.user.editor) return res.status(403).send("Forbidden");

  next();
};
