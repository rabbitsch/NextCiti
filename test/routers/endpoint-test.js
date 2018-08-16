const chai = require('chai');
const mongoose = require('mongoose');
const chaihttp = require('chai-http');
const faker = require('faker');


const should = chai.should();
mongoose.Promise = global.Promise;

const { City }  = require('../src/models/city');
const { closeServer, runServer, app } = require('../src/server');
const { TEST_DATABASE_URL } = require('../src/config');

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
function seedingData(){
  console.log('seeding DB')
  const seedData = [];
  for(let i=0; i<10; i++) //i would of done seedData.length
    seedData.push({
      name: faker.txt(),
      pros: faker.txt(),
      cons: faker.txt()
    })
    return City.insertMany(seedData);

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



describe('testing GET endpoints', function(){


  it('should return all posts',function(){
    let res;
    return chai.request(app)
      .get('/')
      .then(_res =>{
        res = _res;
        res.should.have.status(200);
        res.body.should.have.lengthOf.at.least(1);
        return City.count();
      })
      .then(post =>{
        res.body.should.have.lengthOf(post);
      });
  });

  it('should test posts with correct fields',function(){
    let respPost;
    return chai.request(app)
      .get('/')
      .then(function(res){
        res.should.have.status(200);
        res.should.be.JSON;
        res.should.be.a('object');
        res.body.should.have.lengthOf.at.least(1);

        res.body.forEach(function(data){
          data.should.include.keys('name','pros','cons');
        });
        respPost = res.body[0];
        return City.findById(respPost.id);
      })
      .then(post =>{
        respPost.name.should.equal(post.name);
        respPost.pros.should.equal(post.pros);
        respPost.cons.should.equal(post.cons);
      });
  });
});

describe('testing POST endpoints', function(){

  it('should add a new post', function(){
    const contentAdd = {
      name: 'atlanta',
      pros: 'seems green',
      cons:'far'
    }
    return chai.request(app)
      .get('/')
      .then(res =>{
        res.should.have.status(200);
        res.should.be.JSON;
        res.should.be.a('object');
        res.body.should.include.keys('name','pros','cons');
        res.body.name.should.be.equal(contentAdd.name);
        res.body.pros.should.be.equal(contentAdd.pros);
        res.body.cons.should.be.equal(contentAdd.cons);

        // res.body.forEach(function(data){
        //   data.should.be.a('object');

        //why write another promise.. for post? seems redunant?
        });
      });
  });


  describes('testing my put endpoint', function(){
    it('should test my put end point',function(){
      const updatedContent = {
        name: "california",
        pros:"beautiful",
        cons: "lots of people"
      }
      return chai.request(app)
        .get('/:id')
        .then(chkId =>
        updatedContent.id = chkId.id)
        .then(function(res){
          res.should.have.status(204);
          return City.findById(updatedContent.id);
          // res.should.be.a('object');
          // res.should.include.keys('name','pros','cons');
        })
        .then(data=>{
          data.name.equal(updatedContent.name);
          data.pros.equal(updatedContent.pros);
          data.cons.equal(updatedContent.cons);
        });

    });
  });

  describe('test the delete endpoint', function(){
    it('should test my delete endpoint', function(){
        let post;

        return City
          .findOne()
          .then(_post=>{
            post = _post;
            return chai.request(app).delete(`/${post.id}`);
          })
          .then(res => {
            res.should.have.status(204);
            return City.findById(post.id);
          })
          .then(tst=>{
            should.not.exist(tst);
          });
    });
  });
