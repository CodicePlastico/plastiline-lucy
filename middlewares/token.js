const jws = require('jws')

function errorResponse(res){
  return res.status(401).send({
    success: false,
    message: 'No valid token provided.'
  })
}

module.exports = function(settings) {
  return function verifyToken(req, res, next){
    var token = req.params.token || req.headers.authorization;
    var isValid = false
    if (token) {
      try {
        isValid = jws.verify(token, settings.jws.alg, settings.jws.secret)
      } catch(err) {
        req.logger.error(err)
        return errorResponse(res)
      }
      if(isValid) {
        const payload = JSON.parse(jws.decode(token).payload)
        // TODO: verificare che l'utente esista
        res.locals.userInfo = payload
        return next()
      }
    } 
    
    return errorResponse(res)
  }
}