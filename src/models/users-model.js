const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


mongoose.promise=global.promise

const schemaUser = new mongoose.Schema({
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

schemaUser.methods.serialize = function(){
  return{
    username:this.username,
    firstname: this.firstname,
    lastname:this.lastname
  };
};

schemaUser.methods.validatePassword = function(password){
  return bcrypt.compare(password,this.password);
};

schemaUser.statics.hashPassword = function(password){
  return bcrypt.hash(password,10);
};

const User = mongoose.model('user',schemaUser);

module.exports = {User};
