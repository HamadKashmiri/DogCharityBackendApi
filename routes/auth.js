/* auth based on (expanded and modified) from Mosh Hamedani https://github.com/mosh-hamedani/vidly-api-node/blob/master/routes/auth.js */
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const config = require('config');
var cookies = require("cookie-parser");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
 */
 
/**
* @swagger
* /api/auth:
*   post: 
*     tags: [Auth]
*     description: post a new login request
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/Schemas/User' 
*     responses:
*        200:
*         description: Success 
*        401:
*         description: unauthorized - no token 
*        400:
*         description: Token Invalid or details invalid
*/

//POST login user
router.post('/', async (req, res) => {
    const { error } = validateAuth(req.body); // equivalent to getting result.error directly, rather than the above line
    //if invalid, return bad request
    if (error) return res.status(400).send(error.details[0].message)
    // result is dict with details about val, go into the dict and return message to the user

    // check if doesnt exist
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password, please try again'); // no 404, only 400 to hide information from hackers and an ambiguous error message

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
    //compares hasshed with req password hashed with salt from user password
    if (!isPasswordCorrect) return res.status(400).send("Invalid email or password, please try again");
    // pass id as payload for token
    const jwToken = jwt.sign({_id: user._id, role: user.role }, config.get('jwtPrivateKey'));
    res.json(jwToken)

});

/**
* @swagger
* /api/auth/loggedIn:
*   get:
*     parameters:
*     - name: x-jwtoken
*       in: header
*       description: an authorization header
*       required: true
*       type: string     
*     tags: [Auth]
*     description: checks if user is logged in 
*     responses:
*       '200':
*         description: Success
*       '401':
*         description: unauthorized - no token 
*       '400':
*         description: Token Invalid 
*/

//validate token if logged in
router.get('/loggedIn', async (req, res) => {
      
      
      const jwToken = req.header('x-jwtoken');
      console.log(jwToken);
      //401 is unauthenticated
      if (!jwToken) return res.json(false);

      try {
          const verified = jwt.verify(jwToken, config.get('jwtPrivateKey'));
          res.json(true);
      }

      catch (ex) {
          //400 
          res.json(false);
      }

})

function validateAuth(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email(),
    password: passwordComplexity({  min: 5,
                                    max: 250,
                                    lowerCase: 1,
                                    upperCase: 1,
                                    symbol: 1,
                                    requirementCount: 2})
  
  })

  return schema.validate(user);
}

module.exports = router;