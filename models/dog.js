const mongoose = require('mongoose');
const Joi = require('joi');


//schema for dog
const dogSchema = new mongoose.Schema({
    name: { type: String, 
           required: true,
           minlength: 3,
           maxlength: 18
          },
  
    breed: { type: String, 
            required: true },
  
    traits: { type: [ String ],
             default: ['default'],
            validate: {
              validator: function(value) {
                return value.length >= 0;
                //ensures at least 1 trait
              },
              message: 'Dog requires a trait'
            }},
  
    description: { type: String, 
                  required: true },
  
    imageURL: { type: String,
              required: true},
  
    age: { type: Number, 
          required: true },
  
    date: { type: Date, 
           default: Date.now,
          required: false},
  
    gender: { type: String, 
             required: true },
  
    shelterID: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelters' }
})
// Make Dog model
const Dog = mongoose.model("Dogs", dogSchema);

//validate with Joi
function validateDog(dog) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(18).required(),
    breed: Joi.string().required(),
    description: Joi.string().required(),
    imageURL: Joi.string().required(),
    age: Joi.number().required(),
    traits: Joi.array().items(Joi.string()),
    date: Joi.date(),
    gender: Joi.string().required(),
    shelterID: Joi.objectId()
  });

  return schema.validate(dog);
}

exports.Dog = Dog;
exports.validateDog = validateDog;