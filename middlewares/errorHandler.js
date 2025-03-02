async function errorHandler(error, req, res, next) {
    const { message, data } = error;
    const status = error?.status || 500;
    return res.status(status).json({ message, data });
}

module.exports = errorHandler;