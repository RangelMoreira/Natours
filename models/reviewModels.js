//review / rating / createdAt /ref to tour /ref to user
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      typeof: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      typeof: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tours: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      requited: [true, 'Review mus belong to a tour'],
    },
    users: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      requited: [true, 'Review mus belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt -passwordResetExpires -passwordResetToken',
  }).populate({
    path: 'tours',
    select: '-guides',
  });

  next();
});

//We should  use capital letters for the first letter in mondel names
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
