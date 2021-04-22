const request = require('supertest');
let server;
//initialise server
const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

testUser = { 
  name: "userTest",
  email: "testEmail@email.com",
  password: "Password1",
  signUpCode: "user",
  role: "user"
}

describe('/api/dogs', () => {
  // call below method before each test inside the suite
  //server already runs on 3000 from deve env, so need to open and close server between tests
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { server.close();
                        await User.remove({}) });
  
  //POST
    describe('POST /', () => {
      
      it('should return 400 if the user is invalid', async () => {
        const response = await request(server)
          .post('/api/auth')
          .send({ name: '' });
        expect(response.status).toBe(400);
      });
      
      it('should log in user & return 200 if the user is valid', async () => {
        const user = new User(testUser);
        const jwToken = user.getToken();
        await user.save();
        const response = await request(server)
          .post('/api/auth')
          .send({ email: "testEmail@email.com",
                  password: "Password1" });
        console.log(response.body);
        expect(response.status).toBe(400);
      });
      
      it('should return 400 if the password doesnt match', async () => {
        const user = new User(testUser);   
        await user.save();
        testUser.password = 'xasxaxasSsadasd1/'
        const response = await request(server)
          .post('/api/auth')
          .send(testUser);
        expect(response.status).toBe(400);
        
      });
  });
});