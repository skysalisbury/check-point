const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    rawgId: { type: String, required: true },
    title: String,
    coverImage: String,
    genres: [String],
    platforms: [String],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Game', gameSchema);
