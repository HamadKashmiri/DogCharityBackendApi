const request = require('supertest');
let server;
//initialise server

describe('/api/dogs', () => {
  // call below method before each test inside the suite
  //server already runs on 3000 from deve env, so need to open and close server between tests
  beforeEach(() => { server = require('../../index'); })
  afterEach(() => { server.close(); });
    describe('GET /', () => {
      it('should return all dogs', async () => {
         const result = await request(server).get('/api/dogs');
         // 200 response is ok
         expect(result.status).toBe(200);
      });
    });
  });