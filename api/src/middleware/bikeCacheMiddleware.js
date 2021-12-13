/**
 * Attach bikeCache to request
 * @type {import("express").RequestHandler}
 */
module.exports.bikeCacheMiddleware = (cache) => function bikeCache(req, res, next) {
    req.bikeCache = cache;
    return next();
};
