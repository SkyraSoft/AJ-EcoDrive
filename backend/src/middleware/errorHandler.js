import { config } from '../config/env.js'

export function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500)
  
  const response = {
    ok: false,
    error: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  }

  // Include validation errors if available (e.g. from mongoose or validation libraries)
  if (err.errors) {
    response.validationErrors = Object.keys(err.errors).map(key => ({
      field: key,
      message: err.errors[key].message
    }))
  }

  // In development mode, append stack trace for easier debugging
  if (config.nodeEnv === 'development' && statusCode === 500) {
    response.stack = err.stack
  }

  console.error(`[Error] ${req.method} ${req.originalUrl} (${statusCode}):`, err.message)

  res.status(statusCode).json(response)
}
