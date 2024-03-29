const express = require('express')
const router = express.Router();

// const auth = require('../middlewares/auth');


router.use('/auth', require('@routes/auth/auth'));
router.use('/user', require('@routes/user/user'));


module.exports = router;
