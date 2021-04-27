const request = require('supertest');
let server;
//initialise server
const { Shelter } = require('../../models/shelter');
const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

testShelter = {
  name: "testShelter",
  address: "testAddress",
  contactNo: 10
}
describe('/api/shelters', () => {
   // call below method before each test inside the suite
   //server already runs on 3000 from deve env, so need to open and close server between tests
   beforeEach(() => { server = require('../../index'); })
   afterEach(async () => { server.close();
                          // below line removes data from tet db to ensure tests are repeatable
                     await Shelter.remove({}) });
    
   //GET ALL
     describe('GET /', () => {
       Shelter.collection.insertMany([
         { name: 'shelter1' },
         { name: 'shelter2' },
         { name: 'shelter3' },
       ]);
       it('should return all shelters', async () => {
          const result = await request(server).get('/api/shelters');
          // 200 response is ok
          expect(result.status).toBe(200);
          expect(result.body.some(s => s.name === "shelter1")).toBeTruthy();
          expect(result.body.some(s => s.name === "shelter2")).toBeTruthy();
          expect(result.body.some(s => s.name === "shelter3")).toBeTruthy();
       });
     });
  
   //POST
     describe('POST /', () => {
      
       it('should return 401 if unauthorized not logged in', async () => {
         const response = await request(server)
           .post('/api/shelters')
           .send({ name: '' });
         expect(response.status).toBe(401);
       });
      
       it('should return 400 if the shelter is invalid', async () => {        
         const user = new User({ role: "admin" });
         const jwToken = user.getToken();
         const response = await request(server)
           .post('/api/shelters')
           .set('x-jwtoken', jwToken) // set header
           .send({ name: '' });
         expect(response.status).toBe(400);
       });
      
       it('should save shelter & return 200 if the shelter is valid', async () => {
        
         const user = new User({ role: "admin" })
         const jwToken = user.getToken();
         const response = await request(server)
           .post('/api/shelters')
           .set('x-jwtoken', jwToken) // set header
           .send(testShelter);
         const shelter = await Shelter.find({ name: testShelter.name })
         expect(response.status).toBe(200);
         expect(shelter).not.toBe(null);
       });
      
       it('should return valid shelter', async () => {
        
         const user = new User({ role: "admin" })
         const jwToken = user.getToken();
         const response = await request(server)
           .post('/api/shelters')
           .set('x-jwtoken', jwToken) // set header
           .send(testShelter);
        
         const shelter = await Shelter.find({ name: testShelter.name })
         expect(response.body).toHaveProperty('name', testShelter.name);
       });
     });
 
   //DELETE
     describe('Delete /:id', () => {
       it('should return 401 if unauthorized not logged in', async () => {
         const shelter = new Shelter(testShelter);
         await shelter.save();
         const response = await request(server)
           .delete('/api/shelters/' + shelter._id)
           .send({ name: "shelter1" });
         expect(response.status).toBe(401);
       });
      
       it('should delete a valid shelter & return 200', async () => {
         const shelter = new Shelter(testShelter);
         await shelter.save();
         const user = new User({ role: "admin" });
         const jwToken = user.getToken();
         const response = await request(server)
           .delete('/api/shelters/' + shelter.id)
           .set('x-jwtoken', jwToken); // set header       
         expect(response.status).toBe(200);
       });
      
       it('should return 403 if the user is not admin', async () => {
         const id = mongoose.Types.ObjectId();
         const user = new User({ role: "user" })
         const jwToken = user.getToken();
         const response = await request(server)
           .delete('/api/shelters/' + id)
           .set('x-jwtoken', jwToken) // set header        
         expect(response.status).toBe(403);
       });
     });
 });