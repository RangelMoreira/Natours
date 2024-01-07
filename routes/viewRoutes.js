const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour', authController.isLoggedIn, viewsController.getTour);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

//Login
router.get('/login', viewsController.getLoginForm);
module.exports = router;
