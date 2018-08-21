const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const City = require('../models/city');

console.log('can you hear me CRUD router!')

// my GET mongo endpoint
router.get('/city-reviews',(req,res) =>{
  console.log('GET /city-reviews');
  City
  .find().then(posts =>{
      res.json(posts.map(post=> post.serialize()));
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({error:'oh dear lord, something went wrong'})
    });
  });

//my Get mongo endpoint by ID
router.get('/city-reviews/:id',(req,res)=>{
console.log(req.params)

  City
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
      .catch(error =>{
      console.log(error);
      res.status(500).json({error:'mother of pearl, something went wrong'})
    });
});

// router.post('/test',function(req,res){
//   res.send('can you hear me post and stuff')
// });

//My Post Endpoint for Mongo
router.post('/city-reviews',(req,res)=>{

  const requiredkeys = ['name','pros','cons'];
  // console.log({ req });
  for(let i = 0;i<requiredkeys.length;i++){
    const selector = requiredkeys[i];
    // console.log(req.body)
    if(!(selector in req.body)){
      const message = `${selector} is not in the body`
      // console.log(message);
      return res.status(400).send(message);
      }
    }
    City
      .create({
        name:req.body.name,
        pros:req.body.pros,
        cons:req.body.cons
      })
      .then(cityPost => res.status(201).json(cityPost.serialize()))
   .catch(err => {
     console.error(err);
     res.status(500).json({ error: 'Something went wrong' });
   });
 });



//My delete endpoint
 router.delete('/city-reviews/:id', (req, res) => {
  City
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong in delete' });
    });
});



// my put endpoint
router.put('/city-reviews/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'pros', 'cons'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  City.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});




module.exports = router;
