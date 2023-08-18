exports.dateMiddleware = (req, res, next) => {
    console.log(new Date().toLocaleString());
    next();
}