module.exports = (fn) => {
  //This Will  be called by express
  return (req, res, next) => {
    //This will recieve our function
    fn(req, res, next).catch((err) => next(err));
  };
};
