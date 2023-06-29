const errorHandleMiddleware = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.toString() })
  }

  res.status(500).json({ error: err.toString() })
  next()
}

module.exports = errorHandleMiddleware
