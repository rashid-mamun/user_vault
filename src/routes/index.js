const express = require('express');
const router = express.Router();
const publicRoute = require('./public.route');
const userRoute = require('./user.route');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'User Vault API Online, 2025!' });
});
router.use('', publicRoute);
router.use('/users', userRoute);

module.exports = router;