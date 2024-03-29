
var express = require('express');
// const joiValidation = require('../middlewares/joiValidation');
const auth = require('@middlewares/auth');
const { } = require('@schemas');
var router = express.Router();
const userService = require('@services/user/user');
const multer = require('multer');

const uploadImg = multer({
 //dest: 'images',

  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(CR3|png|jpg|jpeg)$/)){
        cb(new Error('Please upload an image.'))
      }
      cb(undefined, true)
      }
})



router.get('/id/:id', auth.ensureSignedIn, async function (req, res, next) {
  const { id } = req.params;
  const result = await userService.findById1(id);
  res.json(result);
})

// all users
router.get('/all', auth.ensureSignedIn, async(req, res, next) => {

  const result = await userService.findAll(req.body.pageNum);
  console.log(result);
  res.json(result);
})

router.post('/reset-password', auth.ensureSignedOut, async (req, res, next) => {
  // to do
  const { id, password ,repeat_password} = req.body;

  const result = await userService.resetPass(id, password,repeat_password);
  res.json(result);
})

router.post('/update-password', auth.ensureSignedIn, auth.currentUser, async (req, res, next) => {
  // to do
  const { id, newPassword ,oldPassword} = req.body;

  const result = await userService.updatePass(id, newPassword,oldPassword);
  res.json(result);
})

router.post('/update/:id', auth.ensureSignedIn,auth.currentUser ,uploadImg.single('upload'),async (req, res, next) => {
  const { username, firstName, lastName, gender, email,dayofbirth,phone,location } = req.body;
  const { id } = req.params;
  // const imageUrl = req.file.buffer;


  const result = await userService.update(id,username,firstName,lastName,gender,email,dayofbirth,location,phone);

  res.json(result);
})

router.get('/users-img', async (req, res) => {
  const result = await userService.finduserImg()
  res.json(result);
})


router.delete('/delete/:id', auth.ensureSignedIn, async (req, res, next) => {
  const { id } = req.params;
  const result = await userService.remove(id);
  res.json(result);
})

module.exports = router
