const express = require('express');
const router = express.Router();
const apiRoutes = require('../controller/user.controller');
const checklogin = require('../middlewares/checkLogin');
const upload = require('../validator/image.validator');

/* application routes */
router.get('', apiRoutes.getAllUser);
router.get('/:id', checklogin, apiRoutes.getOneUser);
router.put('/:id', checklogin, apiRoutes.updateOneUser);
router.delete('/:id', checklogin, apiRoutes.deleteOneUser);
router.put('/change-password/:id', checklogin, apiRoutes.updateOneUserPassword);

router.post(
  '/image/:id',
  checklogin,
  upload.single('avatar'),
  apiRoutes.updateOneUserPicture
);

module.exports = router;
