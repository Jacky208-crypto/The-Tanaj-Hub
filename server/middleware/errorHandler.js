// middleware/errorHandler.js
//
// index.js currently wraps its one route in its own try/catch
// (res.status(500).json({ error: 'Server error' })). As more routes get
// added (see routes/), this would centralize that instead of repeating the
// same try/catch in every controller.
//
// Would hold:
//   - a catch-all 404 handler for unmatched routes
//   - an Express error middleware, (err, req, res, next), that logs the
//     error server-side and always returns the same { error: message } shape
//   - mounted last in index.js, after every other app.use(...)
