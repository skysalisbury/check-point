// const Review = require('../models/review');

// module.exports = {
//   index,
//   show,
//   create,
//   update,
//   deleteReview,
// };

// async function index(req, res) {
//   try {
//     const reviews = await Review.find({});
//     // Below would return all posts for just the logged in user
//     // const posts = await Post.find({author: req.user._id});
//     res.json(reviews);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: 'Failed to fetch Review' });
//   }
// }

// async function create(req, res) {
//   try {
//     req.body.author = req.user._id;
//     const review = await Review.create(req.body);
//     res.json(review);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: 'Failed to fetch Review' });
//   }
// }
