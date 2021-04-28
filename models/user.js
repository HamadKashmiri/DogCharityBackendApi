const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");
const config = require('config');
const jwt = require('jsonwebtoken');
/**

* @class user

* @param {object} schema - contains properties of user

* @mixes {userSchema.methods}

*/
//schema for favourite
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    signUpCode: {
      type: String,
       // default?
    },
    role: {
      type: String,
      required: false
    }
      
});
/** @mixin */
userSchema.methods.getToken = function() {
    //json web token created using id, with private key as 2nd argument 
    const jwToken = jwt.sign({ _id: this._id, role: this.role }, config.get('jwtPrivateKey'));
    return jwToken;
}

// Make User model
const User = mongoose.model("Users", userSchema);

/**

* @function user validation

* @param {object} user - passed user object with property values

* @returns {object} - returns object for validation of the schema 

*/

//validate with Joi
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email(),
    password: passwordComplexity({  min: 5,
                                    max: 250,
                                    lowerCase: 1,
                                    upperCase: 1,
                                    symbol: 1,
                                    requirementCount: 2}),
    signUpCode: Joi.string(),
  
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;