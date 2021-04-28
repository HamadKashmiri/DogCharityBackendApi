const winston = require('winston');
/**

* Middleware function to log errors with winston

* @param {object} err - request object

* @param {object} req - request object

* @param {object} res - response object

* @param {object} next - express next object

* @returns {function} - Next function returned to pass control to next middleware 

*/

function error(err, req, res, next) {
  winston.error(err.message, { meta: err })
  res.status(500).send('Something went wrong.')
}

/** exports the function to use in routes */
module.exports = error