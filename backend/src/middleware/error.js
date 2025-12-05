export function notFound(req, res, next) {
res.status(404).json({ message: "Route not found" });
}


export function errorHandler(err, req, res, next) { // eslint-disable-line
console.error(err);
const code = err.statusCode || 500;
res.status(code).json({ message: err.message || "Server error" });
}