import request from 'supertest';
import app from '../app.js';

describe('when accessing the / endpoint', () => {
  test('should return 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('should return a title inthe body', async () => {
    const response = await request(app).get('/');
    expect(response.body.title).toBe('Blocks Conversion Tool');
  });
});
