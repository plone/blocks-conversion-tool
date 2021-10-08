import express from 'express';
const router = express.Router();

/* GET Server Home */
router.get('/', function (req, res, next) {
  res.json({ title: 'Blocks Conversion Tool' });
});

export default router;
