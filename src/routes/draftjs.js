import express from 'express';
import { body, validationResult } from 'express-validator';
import convertFromHTML from '../converters/fromHtml.js';

// compare differente implementations
import draftToHtml from 'draftjs-to-html';
// import {stateToHTML} from 'draft-js-export-html';
// import { convertToHTML } from 'draft-convert';


const router = express.Router();

/* Post Convert DraftJS to HTML or Blocks */
router.post('/', [body('draftjs').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const draftjs = req.body.draftjs;

  // https://www.npmjs.com/package/draftjs-to-html
  const html = draftjs.map((block) => draftToHtml(
    block.text, 
    // hashtagConfig, 
    // directional, 
    // customEntityTransform
  )).join('\n');
  switch (req.body.converter) {
    case 'slate':
    case 'draftjs':
      const converter = req.body.converter;
      const data = convertFromHTML(html, converter);
      res.json({ data });
      break;
    default:
      res.json({ html });
  }
});

export default router;
