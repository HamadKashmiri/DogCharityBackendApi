const request = require('supertest');
let server;
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user');
const { Dog } = require('../../models/dog');
const mongoose = require('mongoose');

testDog = { name: "dog",
            breed: "newdog",
            description: "new desc",
            imageURL: "new Url",
            age: 6,
            traits: ["trait1"],
            gender: "M"}


describe('authentication - authMiddleware', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {  server.close();
                       await Dog.remove({})});
  
    it('should return 401 if no token provided', async () => {

        const response = await request(server)
        .post('/api/dogs')
        .set('x-jwtoken', '') // no token
        .send(testDog);
      expect(response.status).toBe(401);
    });
  
    it('should return 400 if invalid token', async () => {
        
        const user = new User({ role: "user" });
        const jwToken = user.getToken();
        const response = await request(server)
        .post('/api/dogs')
        .set('x-jwtoken', 'wrong') // bad token
        .send(testDog);
      expect(response.status).toBe(400);
    });
  
    it('should return 200 if valid token', async () => {
        
        const user = new User({ role: "worker" });
        const jwToken = user.getToken();
        const response = await request(server)
        .post('/api/dogs')
        .set('x-jwtoken', jwToken) // bad token
        .send(testDog);
      expect(response.status).toBe(200);
    });
    
   });
