const { admin } = require('./admin')

module.exports = (req, res, next) => {
	let idToken

	if (req.headers.authorization) {
		idToken = req.headers.authorization
	} else {
		console.error('No token found')
		return res.status(403).json({ error: 'Unauthorized' })
	}

	admin
		.auth()
		.verifyIdToken(idToken)
		.then(decodedToken => {
			req.user = decodedToken
			return next()
		})
		.catch(err => {
			console.error(err)
			if (err.code === 'auth/id-token-expired') {
				return res.status(403).json({ error: 'Unauthorized' })
			}
			return res.status(500).json({ error: err.code })
		})
}
