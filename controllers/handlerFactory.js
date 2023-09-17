const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndRemove(req.params.id);

    if (!doc) {
      return next(new AppError('Tour not found with that id', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });