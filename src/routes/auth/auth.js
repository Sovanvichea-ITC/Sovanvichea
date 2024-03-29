var express = require('express');
const joiValidation = require('@middlewares/joiValidation');
const auth = require('@middlewares/auth');
const { signInSchema, signUpSchema } = require('@schemas');
var router = express.Router();
const { login } = require('@services/login')
const { register } = require('@services/auth/register');
const userService = require('@services/user/user');
const { logout } = require('@services/logout');

router.get('/test', async function (req, res, next) {
  try {
    res.send("Hello");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})


router.get('/me', auth.ensureSignedIn, auth.currentUser, async function (req, res, next) {
  const { currentUser } = req;
  const result = await userService.findById(currentUser?._id);
  res.json(result);
})

router.post('/logout',  auth.currentUser,auth.ensureSignedIn, async (req, res) => {
  const result = logout(req.session);
  return res.json(result);
})

router.post('/login', auth.ensureSignedOut, joiValidation(signInSchema), async (req, res, next) => {
  const { email, password } = req.body;
  const result = await login(email, password);

  req.session.jwt = result?.data?.token

  res.json(result);
})

router.post('/register', auth.ensureSignedOut, joiValidation(signUpSchema), async (req, res, next) => {
  const createdUser = await register(req.body)
  res.json(createdUser);
})

router.post('/forgetpassword', auth.ensureSignedOut, async (req, res, next) => {
  const { email } = req.body;
  const result = await userService.forgetpassword(email);
  req.session.jwt = result?.data?.token
  res.json(result);
})

module.exports = router
