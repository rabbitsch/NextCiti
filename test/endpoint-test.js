const chai = require('chai');
const mongoose = require('mongoose');
const chaihttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');



const expect = chai.expect;
const should = chai.should();
mongoose.Promise = global.Promise;

const City = require('../src/models/city');
const config = require('../src/config');
// const createAuthToken = require("../src/routers/router-auth");
const { closeServer, runServer, app } = require('../src/server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../src/config');


console.log('can you hear me mongo test')
chai.use(chaihttp);



function tearDownDb() {
  console.log('Deleting database');
  return mongoose.connection.dropDatabase();
}


//Seed Data base
function seedingData(idFaker, nameFaker, prosFaker, consFaker){
  console.log('seeding DB')
  const seedData = [];
  for(let i=0; i<=i.length; i++){
    seedData.push({
      id: faker.random.uuid(),
      name: faker.address.city(),
      pros: faker.lorem.words(),
      cons: faker.lorem.words()
    })
    return City.insertMany(seedData);
  }
}

function generateHostData() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.name.firstName(),
    password: "123Password",
  };
}


const preAuthHost = function() {
  const genPassword = "Password";
return {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: faker.name.firstName(),
  password: "123Password",
};
};

//my create auth

const createAuthToken = function(user){
  console.log('hi! create Token')
  return jwt.sign({user}, config.JWT_SECRET,{
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};



//
describe('preparing endpoints for tests', function(){


  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedingData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });





describe('testing GET endpoints', function(){


  it('should return all posts',function(){
    let res;
    return City.find()
      .then(host =>{
        const user1 = preAuthHost(host)
        let authToken = createAuthToken(user1);
      return chai.request(app)
        .get('/api/city-reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send(this._id)
    })

      .then(_res =>{
        res = _res;
        expect(res).to.have.status(200);

      })
  });

  it('should test posts with correct fields',function(){
    let respPost;
    const newUserid = this._id
    return City.findOne()
      .then(host =>{
        const user1 = preAuthHost(host)
        let authToken = createAuthToken(user1);
        // console.log('>>>>',{newUserid})

    return chai.request(app)
      .get('/api/city-reviews')
      .set('Authorization', `Bearer ${authToken}`)
      .send({newUserid})

    })
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        res.body.forEach(data=>{
          expect(data).to.include.keys('id','name','pros','cons');
        });
        respPost = res.body[0];

      })

  });

});

describe('testing POST endpoints', function(done){

  it('should add a new post', function(){
    return City.findOne()
      .then(host =>{

        const user1 = preAuthHost(host)

        let authToken = createAuthToken(user1);
        // console.log('>>>>',{newUserid})



})
return chai.request(app)
  .get('/api/users/whoami')
  .set('Authorization', `Bearer ${authToken}`)
  .then(data =>{

    const newName = faker.address.city();
    const newPros = faker.lorem.words();
    const newCons= faker.lorem.words();
    console.log(data.id,'>>>>>>>>>>>>')

    return chai.request(app)
      .post('/api/city-reviews')
      .set('Content-Type','application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        user:this.id,
        name:newName,
        pros:newPros,
        cons:newCons
      })
    })

      .then(res =>{
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('name','pros','cons');
     })

    });
  });


  describe('testing my put endpoint', function(){
    it('should test my put end point',function(){
      const newName = faker.address.city();
      const newPros = faker.lorem.words();
      const newCons= faker.lorem.words();


      return chai.request(app)
        .post('/api/city-reviews')
        .set('Content-Type','application/json')
        .send({
          id:this._id,
          name:newName,
          pros:newPros,
          cons:newCons
        })
      const updatedContent = {

        name: faker.address.city(),
        pros: faker.lorem.words(),
        cons: faker.lorem.words()
      }

      return City.findOne()
        .then(note =>{
        

          return chai.request(app)
            .put(`/api/city-reviews/${id}`)
            .send(updatedContent);
        })
        .then(res =>{
          expect(res).to.have.status(204);
          return City.findbyId(updatedContent.id)
        })
        .then(post=>{
          expect(post.name).to.equal(updatedContent.name);
          expect(post.pros).to.equal(updatedContent.pros);
          expect(post.cons).to.equal(updatedContent.cons);
        });

    });
  });

  describe('test the delete endpoint', function(){
    it('should test my delete endpoint', function(){
      const newName = faker.address.city();
      const newPros = faker.lorem.words();
      const newCons= faker.lorem.words();


      return chai.request(app)
        .post('/api/city-reviews')
        .set('Content-Type','application/json')
        .send({
          id:this._id,
          name:newName,
          pros:newPros,
          cons:newCons
        })
        let post;

        return City.findOne()
          .then(_post=>{
            post = _post;
            return chai.request(app).delete(`/${id}`);
          })
          .then(res => {
            expect(res).to.have.status(204);
            return City.findById(post.id);
          })
          .then(tst=>{
            expect(tst).to.be.null;
          });
    });
  });

});
