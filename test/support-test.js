const chai = require('chai');
const mongoose = require('mongoose');
const chaihttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');



const expect = chai.expect;
const should = chai.should();
mongoose.Promise = global.Promise;

const { Note } = require('../src/models/note')
const { City }  = require('../src/models/city');
const { closeServer, runServer, app } = require('../src/server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../src/config');

console.log(City)
console.log('can you hear me mongo test')
chai.use(chaihttp);

//emptys my database after each test
function tearDownDb(){
  return new Promise((resolve,reject)=>{
    console.log('test DB deleted')
    mongoose.connection.dropDatabase()
    .then(result =>resolve(result))
    .catch(error =>reject(error));
  });
}


//Seed Data base
function SeedPostData(){
  console.log('seeding DB')
  const seedData = [];
  for(let i=0; i<10; i++){
    seedData.push
  }
  return City.insertMany(seedData);
}

//Generates random data
 function generatePostData(){

    const content = {
      id: faker.random.uuid(),
      name: faker.address.city(),
      pros: faker.lorem.words(),
      cons: faker.lorem.words()
    }
    return content;
}

//Generates Random User Data
function generateUserData(){
  return {
    username: faker.internet.userName(),
    password: faker.internet.password()
  }
}


//
describe('preparing endpoints for tests', function(){

  before(function(done){
    return runServer(TEST_DATABASE_URL).then(function(){
      done();
    }).catch(function(error){
      console.log(error)
    })
  });


  beforeEach(function(){
    return seedingData();
  });

  afterEach(function(){
    return tearDownDb();
  });


  after(function(done){
    return closeServer().then(function(){
      done();
    }).catch(function(error){
      console.log(error)
    });
  })

});
