const express = require('express');
const router = express.Router();
const Promise = require('promise');

const ImageController = require('../controllers/ImageController.js');


router.post('/', ImageController.index);

module.exports = router;