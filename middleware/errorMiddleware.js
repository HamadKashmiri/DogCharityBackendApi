const winston = require('winston');
 
function error(err, req, res, next) {
  winston.error(err.message, { meta: err })
  res.status(500).send('Something went wrong.')
}

module.exports = error