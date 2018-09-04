const mongoose = require('mongoose');

console.log('can you hear me city model!')

const schema = new mongoose.Schema({
  name: { type: String },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
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
