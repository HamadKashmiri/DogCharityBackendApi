/**

* Middleware function to check for role is worker

* @param {object} req - request object

* @param {object} res - response object

* @param {next} res - express next object to pass control

* @returns {function} - Next function returned to pass control to next middleware 

*/

function workerAuth(req, res, next) {

    //401 unauthorized //403forbidden
    if (req.user.role != "worker") return res.status(403).send("access denied");

    next();
}

/** exports the function to use in routes */
module.exports = workerAuth;