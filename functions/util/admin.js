const admin = require('firebase-admin')
const serviceAcc = require('./ius-springfest-quiz-firebase-adminsdk-kqcpo-c158f8afa3')
admin.initializeApp({
	credential: admin.credential.cert(serviceAcc),
	databaseURL: 'https://springfestquiz.firebaseio.com'
})
const db = admin.firestore()
const configDocumentId = 'I2ndtZ1onSaHO9FAGZ4a'

const getAppConfig = () => {
	return new Promise(resolve => {
		db.collection('adminConfig')
			.doc(configDocumentId)
			.get()
			.then(doc => {
				resolve(doc.data())
			})
			.catch(err => {
				console.error(err)
			})
	})
}

module.exports = { admin, db, getAppConfig, configDocumentId }
