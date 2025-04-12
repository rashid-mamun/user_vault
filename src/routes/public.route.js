const express = require('express');
const router = express.Router();
const apiRoutes = require('../controller/public.controller');


router.post('/register', apiRoutes.register);
router.post('/login', apiRoutes.login);
module.exports = router;
