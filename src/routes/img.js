var express = require('express');
const joiValidation = require('../../middlewares/joiValidation');
const { signInSchema, signUpSchema } = require('../../schemas');
var router = express.Router();
const { login } = require('../../services/login')
const { register } = require('../../services/register');
const userService = require('../../services/user');
const { logout } = require('../../services/logout');
const Images = require('../../services/img');
const auth = require('../../middlewares/auth');
const multer = require('multer');

const uploadImg = multer({
 //dest: 'images',

  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
        cb(new Error('Please upload an image.'))
      }
      cb(undefined, true)
      }
})


router.post('/image/profile/create', uploadImg.single('upload'), async (req, res) => {
try {

  const imageUrl = req.file.buffer;

  const { name, userID, desc } = req.body;

  console.log(name,userID,imageUrl,desc)
  result = await Images.create(name,userID,imageUrl,desc);
  res.json(result);

  } catch (e){
  res.status(400).send(e)
}
}, (error, req, res, next) => {
res.status(400).send({error: error.message})
})

router.post('/image/profile/update', uploadImg.single('upload'), async (req, res) => {
try {

  const imageUrl = req.file.buffer;

  const { id } = req.body;

  result = await Images.update(id,imageUrl);
  res.json(result);

  } catch (e){
  res.status(400).send(e);
}
}, (error, req, res, next) => {
res.status(400).send({error: error.message})
})


router.get('/image/id/:id', async(req, res, next)=> {
  const { id } = req.params;

  const result = await Images.findById(id);
  res.json(result);
})

router.get('/image/all', async(req, res, next) => {

  const result = await Images.findAll();

  res.json(result);
})

router.delete('/image/profile/delete/id/:id', auth.ensureSignedIn, async (req, res, next) => {
  const { id } = req.params;
  const result = await Images.remove(id);
  res.json(result);
})

module.exports = router
