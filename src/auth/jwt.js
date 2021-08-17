const jwt = require('jsonwebtoken')
const config = require('../../config')

const getTokenFrom = req => {
  let authorization = req.cookies ? req.cookies['jwt'] : false
  //console.log(authorization);
  return authorization
};

exports.sign = async (data) =>{
  let token = await jwt.sign(data, config.jwt_secret)
  return token
}

exports.verifyDoc = async (req,res,next) => {
  let token = await getTokenFrom(req);
  const decodedToken = await jwt.verify(token, config.jwt_secret);
  if(!token || !decodedToken){
    return res.status(401).json({error:'token missing or invalid'});
  }
  next();
};
