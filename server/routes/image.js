// @ts-nocheck
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../models');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, `image_${Date.now()}${ext}`);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', upload.single('image'), async (req, res, next) => {
  console.log(req.body);
  try {
    await db.Image.create({
      fileName: req.file.filename,
      sequence: req.body.sequence,
    })
    return res.json(req.file.filename);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;