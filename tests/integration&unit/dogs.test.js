const request = require('supertest');
let server;
//initialise server
const { Dog } = require('../../models/dog');
const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// vars
testDog = { name: "dog",
            breed: "newdog",
            description: "new desc",
            imageURL: "new Url",
            age: 6,
            traits: ["trait1"],
            gender: "M"}

testUpdateDog = { name: "dogUpdated",
            breed: "newdog",
            description: "new desc",
            imageURL: "new Url",
            age: 6,
            traits: ["trait1"],
            gender: "M"}

describe('/api/dogs', () => {
  // call below method before each test inside the suite
  //server already runs on 3000 from deve env, so need to open and close server between tests
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { server.close();
                         // below line removes data from tet db to ensure tests are repeatable
                    await Dog.remove({}) });
    
  //GET ALL
    describe('GET /', () => {
      Dog.collection.insertMany([
        { name: 'dog1' },
        { name: 'dog2' },
        { name: 'dog3' },
      ]);
      it('should return all dogs', async () => {
         const result = await request(server).get('/api/dogs');
         // 200 response is ok
         expect(result.status).toBe(200);
         expect(result.body.some(dog => dog.name === "dog1")).toBeTruthy();
         expect(result.body.some(dog => dog.name === "dog2")).toBeTruthy();
         expect(result.body.some(dog => dog.name === "dog3")).toBeTruthy();
      });
    });
  
  //GET by id
    describe('GET /:id', () => {
      it('should return dog & 200 if valid id passed', async () => {
        
         const user = new User({ role: "user" });
         const jwToken = user.getToken();
         const dog = new Dog(testDog);
         await dog.save();
         const result = await request(server)
           .get('/api/dogs/' + dog.id)
           .set('x-jwtoken', jwToken);
         expect(result.status).toBe(200); 
         expect(result.body).toHaveProperty('name', dog.name);
      });
      
      // change to 404 when login stuff is done
      it('should return 401 if invalid id passed', async () => {
         const result = await request(server).get('/api/dogs/1');
         expect(result.status).toBe(401); 
      });
            
    });
  
  //POST
    describe('POST /', () => {
      
      it('should return 401 if unauthorized not logged in', async () => {
        const response = await request(server)
          .post('/api/dogs')
          .send({ name: 'dog1' });
        expect(response.status).toBe(401);
      });
      
      it('should return 400 if the dog is invalid', async () => {
        
        const user = new User({ role: "worker" });
        const jwToken = user.getToken();
        const response = await request(server)
          .post('/api/dogs')
          .set('x-jwtoken', jwToken) // set header
          .send({ name: '' });
        expect(response.status).toBe(400);
      });
      
      it('should save dog & return 200 if the dog is valid', async () => {
        
        const user = new User({ role: "worker" })
        const jwToken = user.getToken();
        const response = await request(server)
          .post('/api/dogs')
          .set('x-jwtoken', jwToken) // set header
          .send(testDog);
        
        const dog = await Dog.find({ name: testDog.name })
        expect(response.status).toBe(200);
        expect(dog).not.toBe(null);
      });
      
      it('should return valid dog', async () => {
        
        const user = new User({ role: "worker" })
        const jwToken = user.getToken();
        const response = await request(server)
          .post('/api/dogs')
          .set('x-jwtoken', jwToken) // set header
          .send(testDog);
        
        const dog = await Dog.find({ name: testDog.name })
        expect(response.body).toHaveProperty('name', testDog.name);
      });
    });
  
   
  //PUT
    describe('PUT /', () => {
    
      it('should return 401 if unauthorized not logged in', async () => {
        const dog = new Dog(testDog);
        await dog.save();
        const response = await request(server)
          .put('/api/dogs/' + dog.id)
          .send({ name: 'dog1' });
        expect(response.status).toBe(401);
      });
      
      it('should save dog & return 200 if the dog is valid', async () => {
        const user = new User({ role: "worker" })
        const jwToken = user.getToken();
        const dog = new Dog(testDog);
         await dog.save();
        const response = await request(server)
          .put('/api/dogs/' + dog.id)
          .set('x-jwtoken', jwToken) // set header
          .send(testUpdateDog);
        
        const updatedDog = await Dog.find({ name: testUpdateDog.name })
        expect(response.status).toBe(200);
        expect(updatedDog).not.toBe(null);
      });
      
      it('should return 400 if the dog is invalid', async () => {
        const user = new User({ role: "worker" })
        const jwToken = user.getToken();
        const dog = new Dog(testDog);
         await dog.save();
        const response = await request(server)
          .put('/api/dogs/' + dog.id)
          .set('x-jwtoken', jwToken) // set header
          .send({ name: ""});
        
        expect(response.status).toBe(400);
      });
      
      

    });
  
  //DELETE
    describe('Delete /:id', () => {
      
      it('should return 401 if unauthorized not logged in', async () => {
        const dog = new Dog(testDog);
        await dog.save();
        const response = await request(server)
          .delete('/api/dogs/' + dog.id)
          .send({ name: 'dog1' });
        expect(response.status).toBe(401);
      });
      
      it('should delete a valid dog & return 200', async () => {
        const dog = new Dog(testDog);
        await dog.save();
        const user = new User({ role: "worker" })
        const jwToken = user.getToken();
        const response = await request(server)
          .delete('/api/dogs/' + dog.id)
          .set('x-jwtoken', jwToken); // set header       
        expect(response.status).toBe(200);
      });
      
      it('should return 403 if the user is not worker', async () => {
         const id = mongoose.Types.ObjectId();
         const user = new User({ role: "user" })
         const jwToken = user.getToken();
         const response = await request(server)
           .delete('/api/dogs/' + id)
           .set('x-jwtoken', jwToken) // set header  
         expect(response.status).toBe(403);
       });
    });
});