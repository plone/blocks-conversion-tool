
import request from 'supertest';
import app from '../app.js';

describe('when accessing the /draftjs endpoint', () => {
  const endpoint = '/draftjs';
  const draftjs = [
    {
      "@type": "text",
      "text": {
        "blocks": [
          {
            "key": "2eesh",
            "text": "Would you like to help with this effort?",
            "type": "header-two",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
          }
        ],
        "entityMap": {}
      }
    }
  ];

  describe('and passing html as converter', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).post(endpoint).send({
        draftjs: draftjs,
        converter: 'html',
      });
      expect(response.statusCode).toBe(200);
    });
    test('should contain html', async () => {
      const response = await request(app).post(endpoint).send({
        draftjs: draftjs,
        converter: 'html',
      });
      const html = response.body.html;
      expect(html).toBe('<h2>Would you like to help with this effort?</h2>\n');
    });
  });

  describe('and passing slate as converter', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).post(endpoint).send({
        draftjs: draftjs,
        converter: 'slate',
      });
      expect(response.statusCode).toBe(200);
    });
    test('should contain slate block', async () => {
      const response = await request(app).post(endpoint).send({
        draftjs: draftjs,
        converter: 'slate',
      });
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0]['@type']).toBe('slate');
      expect(response.body.data[0]['plaintext']).toBe('Would you like to help with this effort?');
      expect(response.body.data[0]['value'].length).toBe(1);
      expect(response.body.data[0]['value'][0]['type']).toBe('h2');
      expect(response.body.data[0]['value'][0]['children'].length).toBe(1);
      expect(response.body.data[0]['value'][0]['children'][0].text).toBe('Would you like to help with this effort?');
    });
  });

  describe('and passing draftjs as converter, mostly useless', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).post(endpoint).send({
        draftjs: draftjs,
        converter: 'draftjs',
      });
      expect(response.statusCode).toBe(200);
    });
    test('should contain draftjs block', async () => {
      const response = await request(app).post(endpoint).send({
        draftjs: draftjs,
        converter: 'draftjs',
      });
      // key is different every time
      // expect(response.body.data).toBe(draftjs);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0]['@type']).toBe('text');
      expect(response.body.data[0].text.blocks[0].text).toBe('Would you like to help with this effort?');
      expect(response.body.data[0].text.blocks[0].type).toBe('header-two');
    });
  });

  // describe('and passing slate as converter', () => {
  //   test('should return 200 status code', async () => {
  //     const response = await request(app).post(endpoint).send({
  //       html: html,
  //       converter: 'slate',
  //     });
  //     expect(response.statusCode).toBe(200);
  //   });
  //   test('should contain one block', async () => {
  //     const response = await request(app).post(endpoint).send({
  //       html: html,
  //       converter: 'slate',
  //     });
  //     const data = response.body.data;
  //     expect(data).toHaveLength(1);
  //     const firstBlock = data[0];
  //     expect(firstBlock['@type']).toBe('slate');
  //     expect(firstBlock.plaintext).toBe(
  //       'Would you like to help with this effort?',
  //     );
  //     expect(firstBlock.value[0].type).toBe('h2');
  //   });
  // });
});
