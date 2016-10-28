const jws = require('jws')

module.exports = function fakeSignature(id, email, jwsCfg) {
	const fakeSignature = jws.sign({
		header: { alg:  jwsCfg.alg },
		payload: {id: id, email: email},
		secret: jwsCfg.secret,
	})
	return fakeSignature
}