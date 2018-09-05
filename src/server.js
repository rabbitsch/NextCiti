require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })

// All my dependencies
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const cors = require('cors');



//All my router connections

const { localStrategy, jwtStrategy } = require('./auth/strategy-auth');

const routerPoint = require('./routers/router-points');
const wolframRouter = require('./routers/router-wolf');
const userRouter = require('./routers/users-router');
const authRouter = require('./routers/router-auth');
const fourRouter = require('./routers/router-four');
const geoRouter = require('./routers/router-geo');
const pkg = require('../package.json');
const { DATABASE_URL, PORT } = require('./config');
const app = express();





//Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'front-end')))
mongoose.Promise = global.Promise;
passport.use(localStrategy);
passport.use(jwtStrategy);

//Logging
app.use(morgan('common'));

//My routes!
app.use('/api',authRouter);
app.use('/api',routerPoint);
app.use('/api/users',userRouter);
app.use('/wolfram', wolframRouter);
app.use('/four', fourRouter);
app.use('/geo', geoRouter);


// app.get('/', (req, res) => res.end(`NextCiti API ${pkg.version}`))




//CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

const jwtAuth = passport.authenticate('jwt',{session: false});




//Run server
var server;

function runServer(){
  const PORT = process.env.PORT || 8080;
  return new Promise((resolve,reject)=>{
    mongoose.connect(DATABASE_URL,error =>{
      if(error){
        return reject(error);
      }
    server = app.listen(PORT, function(){
      console.log(`Port is listening on ${process.env.PORT || 8080}`)
      resolve(server);
    })
    .on('error',function(error){
      mongoose.disconnect();
      console.log('we got an error on our hands, roger')
      reject(error);
    });
  });
})
}


//Close Server
function closeServer(){
  return mongoose.disconnect().then(()=>{

  return new Promise((resolve,reject)=>{
    console.log('server is closing')
    server.close(err =>{
      if(error => {
        return reject(error);
      })
      resolve();
    })
    });
  });
};




if (require.main === module) {
  runServer(DATABASE_URL)
    .catch(err => {
      console.error('Unable to start the server.')
      console.error(err)
    })
};


module.exports = {runServer,closeServer,app};
