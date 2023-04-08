const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * VerficationLink Schema
 */
var verificationLinkSchema = new Schema({
  link: {
    type: String,
  },
  userId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('verificationLinks', verificationLinkSchema);