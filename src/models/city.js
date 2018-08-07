const mongoose = require('mongoose');

mongoose.promise = global.promise;

const schema = new mongoose.Schema({
  name: { type: String },
  pros: { type: [String] },
  cons: { type: [String] }
});

schema.methods.serialize = function () {
  return {
    id: this._id,
    name: this.name,
    pros: this.pros,
    cons: this.cons
  }
}

const City = mongoose.model('City', schema);
module.exports = City
