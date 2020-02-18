const { validateLoginData } = require('../util/validators')
const { db, getAppConfig, configDocumentId, admin } = require('../util/admin')
const { isNumber, checkLoginTime } = require('../util/utilFunctions')
const firebase = require('firebase')
firebase.initializeApp(require('../util/firebaseConfig'))

exports.adminLoad = (req, res) => {
	return res.json({ isAuthenticated: true })
}

exports.adminLogin = (req, res) => {
	const adminData = {
		email: req.body.email,
		password: req.body.password
	}

	const { valid, errors } = validateLoginData(adminData)
	if (!valid) return res.status(400).json(errors)

	firebase
		.auth()
		.signInWithEmailAndPassword(adminData.email, adminData.password)
		.then(data => data.user.getIdToken())
		.then(async token => {
			const decodedToken = await admin.auth().verifyIdToken(token)
			const loginStatusData = await db
				.collection('loginInfo')
				.doc('status')
				.get()
			const { isLoggedIn, loggedInAt } = loginStatusData.data()

			if (decodedToken.uid === 'ZLjjMSPMdWcTfQz1KjPLhnOBFAr1') {
				return res.json({ token })
			}

			if (!isLoggedIn || (isLoggedIn && !checkLoginTime(loggedInAt))) {
				db.collection('loginInfo')
					.doc('status')
					.update({
						isLoggedIn: true,
						loggedInAt: admin.firestore.Timestamp.now()
					})
					.then(() => {
						return res.json({ token })
					})
			} else {
				return res.status(400).json({
					message: 'This account is already logged in!'
				})
			}
		})
		.catch(err => {
			console.error(err)
			if (
				err.code === 'auth/wrong-password' ||
				err.code === 'auth/user-not-found'
			) {
				return res.status(403).json({
					message: 'Invalid credentials, please try again!'
				})
			} else return res.status(500).json({ error: err.code })
		})

		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}

exports.adminLogout = (req, res) => {
	if (req.user.uid === 'ZLjjMSPMdWcTfQz1KjPLhnOBFAr1') {
		return res.json({ message: 'Successfully logged out!' })
	} else {
		db.collection('loginInfo')
			.doc('status')
			.update({ isLoggedIn: false })
			.then(() => {
				return res.json({ message: 'Successfully logged out!' })
			})
			.catch(err => {
				console.error(err)
				return res.status(500).json({ error: err.code })
			})
	}
}

exports.getTheRankList = (req, res) => {
	db.collection('users')
		.orderBy('rank', 'asc')
		.get()
		.then(data => {
			let users = []
			data.forEach(doc => {
				const { answers, ...toSend } = doc.data()
				users.push(toSend)
			})
			return res.json(users)
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}

exports.resetQuiz = async (req, res) => {
	const promises = []
	db.collection('users')
		.get()
		.then(data => {
			data.forEach(doc => {
				promises.push(doc.ref.delete())
			})
			return db.collection('questions').get()
		})
		.then(data => {
			data.forEach(doc => {
				promises.push(doc.ref.delete())
			})
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
	Promise.all(promises)
	return res.json({ message: 'Quiz reset successfully' })
}

exports.postConfig = (req, res) => {
	let timeForQuiz = req.body.timeForQuiz
	let questionsNumber = req.body.questionsNumber
	let isQuizBlocked = req.body.isQuizBlocked
	const appConfig = {}
	appConfig.timeForQuiz = timeForQuiz
	appConfig.questionsNumber = questionsNumber
	appConfig.isQuizBlocked = isQuizBlocked
	req.body.isRankListVisible !== undefined
		? (appConfig.isRankListVisible = req.body.isRankListVisible)
		: (appConfig.isRankListVisible = false)

	if (
		!isNumber(appConfig.timeForQuiz) ||
		!isNumber(appConfig.questionsNumber)
	) {
		return res.status(400).json({ message: 'Bad request' })
	}
	db.collection('questions')
		.get()
		.then(snap => {
			if (snap.size < questionsNumber) {
				appConfig.questionsNumber = snap.size
			}
			return db
				.collection('adminConfig')
				.doc(configDocumentId)
				.update(appConfig)
		})
		.then(() => {
			return res.json({
				message: 'Config set successfully',
				timeForQuiz: appConfig.timeForQuiz,
				questionsNumber: appConfig.questionsNumber,
				isQuizBlocked: appConfig.isQuizBlocked,
				isRankListVisible: appConfig.isRankListVisible
			})
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}

exports.getConfig = async (req, res) => {
	const {
		timeForQuiz,
		questionsNumber,
		isQuizBlocked,
		isRankListVisible
	} = await getAppConfig()
	return res.json({
		timeForQuiz,
		questionsNumber,
		isQuizBlocked,
		isRankListVisible
	})
}

exports.postNewQuestion = (req, res) => {
	const newQuestion = {
		text: req.body.text,
		answers: [],
		createdAt: new Date().toISOString()
	}

	req.body.answers.forEach(answer => {
		newQuestion.answers.push({
			id: Math.round(Math.random() * 10000000000),
			body: answer.body,
			isTrue: answer.isTrue
		})
	})

	if (
		newQuestion.answers.filter(answer => answer.isTrue === true).length !==
			1 ||
		newQuestion.text.trim() === '' ||
		newQuestion.answers.filter(answer => answer.body.trim() === '').length >
			0
	) {
		return res.status(400).json({ error: 'Bad data!' })
	}

	db.collection('questions')
		.add(newQuestion)
		.then(() => {
			return db
				.collection('questions')
				.orderBy('createdAt')
				.get()
		})
		.then(data => {
			let questions = []
			data.forEach(doc => {
				questions.push({
					id: doc.id,
					text: doc.data().text,
					answers: doc.data().answers
				})
			})
			return res.json({ questions })
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}

exports.editQuestion = (req, res) => {
	const questionId = req.params.questionId
	const newFields = {
		text: req.body.text,
		answers: []
	}

	req.body.answers.forEach(answer => {
		newFields.answers.push({
			id: Math.round(Math.random() * 10000000000),
			body: answer.body,
			isTrue: answer.isTrue
		})
	})

	if (
		newFields.answers.filter(answer => answer.isTrue === true).length !==
			1 ||
		newFields.text.trim() === '' ||
		newFields.answers.filter(answer => answer.body.trim() === '').length > 0
	) {
		return res.status(400).json({ error: 'Bad data!' })
	}

	db.collection('questions')
		.doc(questionId)
		.update(newFields)
		.then(() => {
			return db
				.collection('questions')
				.orderBy('createdAt')
				.get()
		})
		.then(data => {
			let questions = []
			data.forEach(doc => {
				questions.push({
					id: doc.id,
					text: doc.data().text,
					answers: doc.data().answers
				})
			})
			return res.json({ questions })
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}

exports.deleteQuestion = (req, res) => {
	const deleteId = req.params.deleteId

	db.collection('questions')
		.doc(deleteId)
		.delete()
		.then(() => {
			console.log('Document deleted')
			return res.json({
				deleteId,
				message: 'Document deleted successfully!'
			})
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}

exports.getAllQuestions = (req, res) => {
	db.collection('questions')
		.orderBy('createdAt')
		.get()
		.then(data => {
			let questions = []
			data.forEach(doc => {
				questions.push({
					id: doc.id,
					text: doc.data().text,
					answers: doc.data().answers
				})
			})
			return res.json({ questions })
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}

exports.getSingleQuestion = (req, res) => {
	const questionId = req.params.questionId

	db.collection('questions')
		.doc(questionId)
		.get()
		.then(doc => {
			if (doc.exists) {
				return res.json({ id: doc.id, ...doc.data() })
			} else {
				return res.status(400).json({ message: 'Question not found!' })
			}
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}
