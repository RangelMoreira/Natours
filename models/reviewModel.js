//review / rating / createdAt /ref to tour /ref to user
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      requited: [true, 'Review must belong to be a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      requited: [true, 'Review muts belong to be a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

//We should  use capital letters for the first letter in mondel names
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
