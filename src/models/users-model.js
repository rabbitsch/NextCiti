const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('can you hear me user model!')

const schema = new mongoose.Schema({
  username:{
    type:String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  firstname:{type:String},
  lastname:{type:String}
});

schema.methods.serialize = function(){
  return{
    id: this._id,
    username:this.username,
    firstname: this.firstname,
    lastname:this.lastname
  };
};

schema.methods.validatePassword = function(password){
  return bcrypt.compare(password,this.password);
};

schema.statics.hashPassword = function(password){
  return bcrypt.hash(password,10);
};

const User = mongoose.model('User',schema);

module.exports = {User};
