export function notFoundHandler(req, res, next) {
  res.status(404).json({
    ok: false,
    error: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  })
}
