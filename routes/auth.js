const express = require("express");

const validator = require("express-validator");

const User = require("../models/user")
const authController = require('../controllers/auth')

const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.put("/signup", [
  validator.body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-mail address already exists!");
        }
      });
    })
    .normalizeEmail(),
  validator.body("password").trim().isLength({ min: 5 }),
  validator.body("name").trim().not().isEmpty(),
], authController.signup );

router.post('/login', authController.login)

module.exports = router;
