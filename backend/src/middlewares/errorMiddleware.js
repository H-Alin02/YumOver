const errorHandler = (err, req, res, next) => {
    console.error(err);

    const status = err.status || 500;
    const message = status < 500 ? "Invalid request" : "Internal Server Error"

    res.status(status).json({error: message});
}

export default errorHandler;