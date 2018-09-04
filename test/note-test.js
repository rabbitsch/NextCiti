const chai = require('chai');
const mongoose = require('mongoose');
const chaihttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');



const expect = chai.expect;
const should = chai.should();
mongoose.Promise = global.Promise;

const Note = require('../src/models/note');
const City = require('../src/models/city');
const { closeServer, runServer, app } = require('../src/server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../src/config');
chai.use(chaihttp);

function tearDownDb() {
  console.log('Deleting database');
  return mongoose.connection.dropDatabase();
}


//Seed Data base
function seedingData(){
  console.log('seeding DB')
  const seedData = [];
  for(let i=0; i<=i.length; i++){
    seedData.push({
      id: faker.random.uuid(),
      city: faker.address.city(),
      user: faker.lorem.words(),
      content: faker.lorem.words()
    })
    return Note.insertMany(seedData);
  }
}




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
      return chai.request(app)
        .get('/api/notes')
        // .set('Content-Type', 'application/json')
        .then(_res =>{
          res = _res;
          expect(res).to.have.status(200);
          // return City.count();
        })
        // .then(count =>{
        //   res.body.should.have.lengthOf(count);
        // })
    });

    it('should test posts with correct fields',function(){
      let respPost;
      return chai.request(app)
        .get('/api/notes')
        .then(function(res){
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          // expect(res.body).to.be.a('object');
          // res.body.should.have.lengthOf.at.least(1);

          res.body.forEach(data=>{
            expect(data).to.include.keys('id','city','user','content');
          });
          respPost = res.body[0];
          // return City.findById(respPost.id);
        })
        // .then(post =>{
        //   expect(respPost.name).to.equal(post.name);
        //   expect(respPost.pros).to.equal(post.pros);
        //   expect(respPost.cons).to.equal(post.cons);
        // })
    });

  });

  describe('testing POST endpoints', function(done){

    it('should add a new post', function(){
      // const newId = faker.random.uuid();
      const newCity = faker.address.city();
      const newUser = faker.name.firstName();
      const newContent= faker.lorem.words();
      // const newPost = seedingData();

      // var token = jwt.sign({ user }, JWT_SECRET);

      return chai.request(app)
        .post('/api/notes')
        .set('Content-Type','application/json')
        .send({
          //id:newId,
          city:newCity,
          user:newUser,
          content:newContent
        })
        .then(res =>{
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('city','user','content');
          // expect(res.body.name).to.equal(newName);
          // expect(res.body.pros).to.equal(newPros);
          // expect(res.body.cons).to.equal(newCons);
          // return City.findbyId(res.body.id);
       })
     // .catch((error) => {
     //      assert.isNotOk(error,'Promise error');
     //      done();
     //    });
      });
    });
  });
