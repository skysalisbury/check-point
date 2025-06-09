const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    text: String,
    rating: Number,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    game: { type: Schema.Types.ObjectId, ref: 'Game' },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
