const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  city: {
    require: true,
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'City'
  },
  user: {
    required: true,
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  content: { type: String }
});

schema.methods.serialize = function () {
  return {
    id: this._id,
    city: this.city,
    user: this.user,
    content: this.content
  }
}

const Note = mongoose.model('Note', schema);

module.exports = Note
