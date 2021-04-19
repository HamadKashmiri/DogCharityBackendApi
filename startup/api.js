const Joi = require('joi')

function api() {
    Joi.objectId = require('joi-objectid')(Joi); //joi for objectids, refer to rental model
}
module.exports = api;