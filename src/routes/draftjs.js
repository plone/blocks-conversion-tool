import express from 'express';
import { body, validationResult } from 'express-validator';
import convertFromHTML from '../converters/fromHtml.js';
import convertFromDraftJS from '../converters/fromDraftjs.js';

const router = express.Router();

/* Post Convert DraftJS to HTML or Blocks */
router.post('/', [body('draftjs').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const draftjs = req.body.draftjs;

  const html = draftjs.map((block) => convertFromDraftJS(block.text)).join('\n');

  switch (req.body.converter) {
    case 'slate':
    case 'draftjs':
      const converter = req.body.converter;
      // XXX: This is a bit of a hack, but it works (?)
      const data = convertFromHTML((html[0] === "<") ? html : `<p>${html}</p>`, converter);
      res.json({ data });
      break;
    default:
      res.json({ html });
  }
});

export default router;
