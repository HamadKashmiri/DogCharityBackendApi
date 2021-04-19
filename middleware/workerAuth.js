function workerAuth(req, res, next) {

    //401 unauthorized //403forbidden
    if (req.user.role != "worker") return res.status(403).send("access denied");

    next();
}
module.exports = workerAuth;