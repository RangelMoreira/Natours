const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  //Keys get the kewords(atribute name) of objects
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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
  //2) Filtered out unwante3d fields name that are not allowed to be updated
  //As it is not necessary to update the password, we will use findByIdUpdate
  //The data passed called filteresBody, We are x because we not need updating all body fields
  //new: true -> returns a new object
  //runValidator is necessary because mongoose need to validate

  const filteresBody = filterObj(req.body, 'name', 'email');

  //3) Update user Document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteresBody, {
    new: true,
    runValidator: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead.',
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
//Do not password with this.
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
