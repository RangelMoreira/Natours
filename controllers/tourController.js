const Tour = require('../models/tourModel');
const APIFeature = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price, ratingsAverage, summary, difficulty';
  next();
};

exports.getTour = catchAsync(async (req, res, next) => {
  // const tour = await Tour.findById(req.params.id).populate({
  //   path: 'guides',
  //   select: '-__v -passwordChangedAt -passwordResetExpires -passwordResetToken',
  // });
  //const tour = await Tour.findById(req.params.id);
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError('Tour not found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  const features = new APIFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.createTrour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({ })
  // newTour.save();

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true, //Will just validate if true
  });

  if (!tour) {
    return next(new AppError('Tour not found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndRemove(req.params.id);

  if (!tour) {
    return next(new AppError('Tour not found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null, //No segregate by groups
        _id: { $toUpper: '$difficulty' }, //Grouping by fields
        numTours: { $sum: 1 }, //Add 1 for each document
        numRatings: { $sum: '$ratingAverage' }, // sum of all ratings
        avgRating: { $avg: '$rattingsQuantity' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, //Assending
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //Create a document for each element  of array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, //Grouping by month
        numTourStars: { $sum: 1 },
        tours: { $push: '$name' }, //Array  with tour names
      },
    },
    {
      //Replacing the id field for the label month
      $addFields: { month: '$_id' },
    },
    {
      //Do not show id anymore
      $project: {
        _id: 0,
      },
    },
    {
      //Sorting by descending
      $sort: { numTourStars: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
