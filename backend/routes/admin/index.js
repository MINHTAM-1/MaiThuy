const express = require('express');
const router = express.Router();

router.use('/orders', require('./orders'));
router.use('/reviews', require('./reviews')); 
router.use('/dashboard', require('./dashboard'));

module.exports = router;