const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTS password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  //2) Update user document
  //As it is not necessary to update the password, we will use findByIdUpdate
  //The data passed called X, We are x because we not need updating all body fields
  //new: true -> returns a new object
  //runValidator is necessary because mongoose need to validate

  /*const user = await User.findByIdUpdate(req.user.id, x, {
    new: true,
    runValidator: true,
  });*/
  res.status(200).json({
    status: 'success',
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
