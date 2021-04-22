const request = require('supertest');
let server;
//initialise server
const { Dog } = require('../../models/dog');
const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

testUser = { 
  name: "userTest",
  email: "testEmail@email.com",
  password: "Password1",
  signUpCode: "user"
}

describe('/api/users', () => {
  // call below method before each test inside the suite
  //server already runs on 3000 from deve env, so need to open and close server between tests
  beforeEach(async () => { server = require('../../index');
                     await User.remove({}); })
  afterEach(async () => { server.close();
                         // below line removes data from tet db to ensure tests are repeatable
                    await User.remove({}); });
    
  //GET ALL
    describe('GET /', () => {
      User.collection.insertMany([
        { name: 'user1' },
      ]);
      it('should return all users', async () => {
         const result = await request(server).get('/api/users');
         // 200 response is ok
         expect(result.status).toBe(200);

      });
    });

  
  //POST
    describe('POST /', () => {
      it('should return 400 if the user is invalid', async () => {
        const response = await request(server)
          .post('/api/users')
          .send({});
        expect(response.status).toBe(400);
      });
      
      it('should save user & return 200 if the user is valid', async () => {

        const response = await request(server)
          .post('/api/users') 
          .send(testUser);
        
        const userExists = await User.find({ name: testUser.name })
        expect(response.status).toBe(200);
        expect(userExists).not.toBe(null);
      });
      
      it('should return valid user', async () => {
        const response = await request(server)
          .post('/api/users')
          .send(testUser);
        const user = await User.find({ name: testUser.name })
        expect(response.body).toHaveProperty('name', testUser.name);
      });
    });

});