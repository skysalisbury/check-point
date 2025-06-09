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
//     const reviews = await Review.find({}).populate('author').populate('game');
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

// async function show(req, res) {
//   try {
//     const reviews = await Review.findById(req.params.reviewId)
//       .populate('author')
//       .populate('game');
//     // Below would return all posts for just the logged in user
//     // const posts = await Post.find({author: req.user._id});
//     res.json(reviews);
//   } catch (err) {
//     console.log(err);
//     res.status(404).json({ message: 'Review not found' });
//   }
// }

// async function update(req, res) {
//   try {
//     const review = await Review.findById(req.params.reviewId);
//     if (!review.author.equals(req.user._id)) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//     Object.assign(review, req.body);
//     await review.save();
//     res.json(review);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// }
