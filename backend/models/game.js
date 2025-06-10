const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    rawgId: { type: String, required: true },
    title: String,
    coverImage: String,
    genres: [String],
    platforms: [String],
    released: String,
    developers: [String],
    publishers: [String],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Game', gameSchema);
