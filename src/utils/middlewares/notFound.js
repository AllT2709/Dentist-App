const notFoundErr = (req,res,next) =>{
  res.status(404).json({
    error: 'Not found'
  });
};

module.exports = notFoundErr;