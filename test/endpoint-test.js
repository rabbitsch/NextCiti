const chai = require('chai');
const mongoose = require('mongoose');
const chaihttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');



const expect = chai.expect;
const should = chai.should();
mongoose.Promise = global.Promise;

const { Note } = require('../src/models/note');
const City = require('../src/models/city');
const { closeServer, runServer, app } = require('../src/server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../src/config');


console.log('can you hear me mongo test')
chai.use(chaihttp);

//emptys my database after each test
// function tearDownDb(){
//   return new Promise((resolve,reject)=>{
//     console.log('test DB deleted')
//     mongoose.connection.dropDatabase()
//     .then(result =>resolve(result))
//     .catch(error =>reject(error));
//   });
// }


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
    return chai.request(app)
      .get('/api/city-reviews')
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
      .get('/api/city-reviews')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        // expect(res.body).to.be.a('object');
        // res.body.should.have.lengthOf.at.least(1);

        res.body.forEach(data=>{
          expect(data).to.include.keys('id','name','pros','cons');
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
    const newName = faker.address.city();
    const newPros = faker.lorem.words();
    const newCons= faker.lorem.words();
    // const newPost = seedingData();

    // var token = jwt.sign({ user }, JWT_SECRET);

    return chai.request(app)
      .post('/api/city-reviews')
      .set('Content-Type','application/json')
      .send({
        // id:newId,
        name:newName,
        pros:newPros,
        cons:newCons
      })
      .then(res =>{
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('name','pros','cons');
        // expect(res.body.name).to.equal(newName);
        // expect(res.body.pros).to.equal(newPros);
        // expect(res.body.cons).to.equal(newCons);
        // return City.findbyId(res.body.id);
     })
   .catch((error) => {
        assert.isNotOk(error,'Promise error');
        done();
      });
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
        // id: faker.random.uuid(),
        name: faker.address.city(),
        pros: faker.lorem.words(),
        cons: faker.lorem.words()
      }

      return City.findOne()
        .then(note =>{
          // note.id = updatedContent.id;

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
