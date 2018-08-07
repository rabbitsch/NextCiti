const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const routerPoint = require('./routers/router-points');
const { DATABASE_URL, PORT } = require('./config');

app.use(morgan('common'));

app.use(express.json());
app.use(bodyParser.json());

app.use(routerPoint);


mongoose.Promise = global.Promise;




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
};


//Close Server
function closeServer(){
  return mongoose.disconnect().then(()=>{

  return new Promise((resolve,reject)=>{
    console.log('server is closing')
    server.close(err =>{
      if(error){
        reject(error);
        return;
      }
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
