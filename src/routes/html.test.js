import request from 'supertest';
import app from '../app.js';

describe('when accessing the /html endpoint', () => {
  const endpoint = '/html';
  const html = '<h2>Would you like to help with this effort?</h2>';

  describe('and passing draftjs as converter', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).post(endpoint).send({
        html: html,
        converter: 'draftjs',
      });
      expect(response.statusCode).toBe(200);
    });
    test('should contain one block', async () => {
      const response = await request(app).post(endpoint).send({
        html: html,
        converter: 'draftjs',
      });
      const data = response.body.data;
      expect(data).toHaveLength(1);
      const firstBlock = data[0];
      expect(firstBlock['@type']).toBe('text');
      expect(firstBlock.text.blocks[0]['text']).toBe(
        'Would you like to help with this effort?',
      );
      expect(firstBlock.text.blocks[0]['type']).toBe('header-two');
    });
  });

  describe('and passing slate as converter', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).post(endpoint).send({
        html: html,
        converter: 'slate',
      });
      expect(response.statusCode).toBe(200);
    });
    test('should contain one block', async () => {
      const response = await request(app).post(endpoint).send({
        html: html,
        converter: 'slate',
      });
      const data = response.body.data;
      expect(data).toHaveLength(1);
      const firstBlock = data[0];
      expect(firstBlock['@type']).toBe('slate');
      expect(firstBlock.plaintext).toBe(
        'Would you like to help with this effort?',
      );
      expect(firstBlock.value[0].type).toBe('h2');
    });
  });
});
