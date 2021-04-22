const request = require('supertest');
let server;
//initialise server
const { Favourite } = require('../../models/favourite');
const { User } = require('../../models/user');
const { Dog } = require('../../models/dog');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

testDog = { name: "dog",
            breed: "newdog",
            description: "new desc",
            imageURL: "new Url",
            age: 6,
            traits: ["trait1"],
            gender: "M"}

testUser = {
  name: "userTest",
  email: "testEmail@email.com",
  password: "Password1",
  signUpCode: "user"
}

describe('/api/favourites', () => {
  // call below method before each test inside the suite
  //server already runs on 3000 from deve env, so need to open and close server between tests
  beforeEach(async () => { server = require('../../index');
                           await User.remove({});})
  
  afterEach(async () => { server.close();
                         // below line removes data from tet db to ensure tests are repeatable
                    await Favourite.remove({});
                    await Dog.remove({});
                    await User.remove({}); });
    
  //GET ALL
    describe('GET /', () => {
      it('should return all favourites', async () => {
         const favourite = new Favourite();
         await favourite.save();
         const user = new User({ role: "user" });
         const jwToken = user.getToken();
         const result = await request(server)
             .get('/api/favourites')
             .set('x-jwtoken', jwToken);
         // 200 response is ok
         expect(result.status).toBe(200);
         expect(result.body).not.toBe(null);
      });
    });
  
   //POST
     describe('POST /', () => {
      
       it('should return 401 if unauthorized not logged in', async () => {
         const response = await request(server)
           .post('/api/favourites')
           .send({});
         expect(response.status).toBe(401);
       });
       
     
      
       it('should return 400 if the favourite is invalid', async () => {
        
         const user = new User({ role: "user" });
         const jwToken = user.getToken();
         const response = await request(server)
           .post('/api/favourites')
           .set('x-jwtoken', jwToken) // set header
           .send({ _id: '' });
         expect(response.status).toBe(400);
       });
     
      
       it('should save favourite & return 200 if is valid', async () => {
         const dog = new Dog(testDog);
         const user = new User(testUser);
         const favourite = { dogID: dog.id, userID: user.id };
         const auth = new User({ role: "user" })
         const jwToken = auth.getToken();
         const response = await request(server)
           .post('/api/favourites')
           .set('x-jwtoken', jwToken) // set header
           .send(favourite);
         const favouritePosted = await Favourite.findById(favourite._id);
         expect(response.status).toBe(200);
         expect(favourite).not.toBe(null);
       });
      
       it('should return valid favourite', async () => {
         const dog = new Dog(testDog);
         const user = new User(testUser);
         const favourite = { dogID: dog.id, userID: user.id };
         const auth = new User({ role: "user" })
         const jwToken = auth.getToken();
         const response = await request(server)
           .post('/api/favourites')
           .set('x-jwtoken', jwToken) // set header
           .send(favourite);
         favouritePosted = await Favourite.findById(response.body._id);
         expect(response.body).toHaveProperty('_id', favouritePosted.id);
       });
     });

   //DELETE
     describe('Delete /:id', () => {      
       it('should return 401 if unauthorized not logged in', async () => {
         const dog = new Dog(testDog);
         const user = new User(testUser);
         const favourite = new Favourite({ dogID: dog.id, userID: user.id });
         await favourite.save();
         const response = await request(server)
           .delete('/api/favourites/' + favourite.id)
           .send({ _id: '' });
         expect(response.status).toBe(401);
       });
      
       it('should delete a valid favourite & return 200', async () => {
         const dog = new Dog(testDog);
         const user = new User(testUser);
         const favourite = new Favourite({ dogID: dog.id, userID: user.id });
         await favourite.save();
         const auth = new User({ role: "worker" })
         const jwToken = auth.getToken();
         const response = await request(server)
           .delete('/api/favourites/' + favourite.id)
           .set('x-jwtoken', jwToken); // set header       
         expect(response.status).toBe(200);
       });
      
    });
});