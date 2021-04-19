function adminAuth(req, res, next) {

    //401 unauthorized //403forbidden
    if (req.user.role != "admin") return res.status(403).send("access denied");

    next();
}
module.exports = adminAuth;