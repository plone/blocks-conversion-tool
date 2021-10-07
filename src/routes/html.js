import express from 'express';
import { body, validationResult } from 'express-validator';
import convertFromHTML from '../converters/fromHtml.js';

const router = express.Router();

/* Post Convert HTML to Blocks */
router.post('/', [body('html').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const html = req.body.html;
  const converter = req.body.converter ? req.body.converter : 'slate';
  const data = convertFromHTML(html, converter);
  res.json({ data });
});

export default router;
