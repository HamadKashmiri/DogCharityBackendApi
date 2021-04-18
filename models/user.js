const mongoose = require('mongoose');
const Joi = require('joi');


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
      default: 
    }
      //roles



})
// Make Favourite model
const User = mongoose.model("Users", userSchema);

//validate with Joi
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().required(),
    signUpCode: Joi.string()
  
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;