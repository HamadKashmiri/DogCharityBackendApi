const mongoose = require('mongoose');
const Joi = require('joi');
/**

* @class favourite

* @param {object} schema - contains properties of favourite

*/

//schema for favourite
const favouriteSchema = new mongoose.Schema({
  dogID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dogs'
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  //userID: {
  //  type: mongoose.Schema.Types.ObjectId,
  //  ref: 'Users'
  //},
  //userID
  date: { type: Date, 
          default: Date.now}
})
// Make Favourite model
const Favourite = mongoose.model("Favourites", favouriteSchema);

/**

* @function favourite validation

* @param {object} favourite - passed user object with property values

* @returns {object} - returns object for validation of the schema 

*/

//validate with Joi
function validateFavourite(favourite) {
  const schema = Joi.object({
    dogID: Joi.objectId().required(),
    userID: Joi.objectId(),
    date: Joi.date(),    
  });

  return schema.validate(favourite);
}

exports.Favourite = Favourite;
exports.validateFavourite = validateFavourite;