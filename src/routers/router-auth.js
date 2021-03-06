const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

router.use(bodyParser());

console.log('can you hear me auth router!!')

const createAuthToken = function(user){
  console.log('hi! create Token')
  return jwt.sign({user}, config.JWT_SECRET,{
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session:false});
router.use(bodyParser.json());


router.post('/login',localAuth, (req,res)=>{
  const authToken = createAuthToken(req.user.serialize());
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt',{session:false});

//when the user gets a new auth before the old one expires
  router.post('/refresh', jwtAuth,(req,res)=>{
    const authToken = creatAuthToken(req.user);
    res.json({authToken});
  });



module.exports = router;
// module.exports = createAuthToken;
