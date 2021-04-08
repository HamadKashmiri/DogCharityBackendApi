const mongoose = require('mongoose');
const Joi = require('joi');

//schema for shelters
const shelterSchema = new mongoose.Schema({
  name: { type: String, 
           required: true,
           minlength: 3,
           maxlength: 18
          },
  
  address: { type: String, 
           required: true,
          },
  
  contactNo: { type: Number, 
               required: true,
          },
})
// Make shelter model
const Shelter = mongoose.model("Shelters", shelterSchema);

//validate with Joi
function validateShelter(shelter) {
  const schema = Joi.object({

    name: Joi.string().min(3).max(18).required(),
    address: Joi.string().required(),
    contactNo: Joi.number().required(),
    
  });

  return schema.validate(shelter);
}

exports.Shelter = Shelter;
exports.validateShelter = validateShelter;