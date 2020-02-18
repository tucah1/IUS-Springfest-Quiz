const { db, getAppConfig } = require('../util/admin')
const { updateRankList, sleep } = require('../util/utilFunctions')

exports.getUserQuestions = (req, res) => {
	const userId = req.body.userId
	let questions = []

	if (!(userId.length > 5 && userId.length < 10) || isNaN(userId)) {
		return res.json({ valid: false, questions })
	}

	db.collection('users')
		.get()
		.then(async data => {
			let userExists = false
			data.forEach(doc => {
				if (doc.data().userId === userId) userExists = true
			})

			if (userExists) {
				return res.json({ valid: false, questions })
			}

			const appConfig = await getAppConfig()

			db.collection('users')
				.add({
					userId,
					score: 0,
					questionsNumber: appConfig.questionsNumber
				})
				.then(doc => {
					return db.collection('questions').get()
				})
				.then(data => {
					data.forEach(doc =>
						questions.push({
							id: doc.id,
							text: doc.data().text,
							answers: doc.data().answers.map(answer => {
								return { id: answer.id, body: answer.body }
							})
						})
					)

					let chooseQuestions = []
					let chosenQuestions = []
					for (let i = 1; i <= appConfig.questionsNumber; i++) {
						let randomNumber = Math.round(
							Math.random() * (questions.length - 1)
						)
						while (chooseQuestions.includes(randomNumber)) {
							randomNumber = Math.round(
								Math.random() * (questions.length - 1)
							)
						}
						chooseQuestions.push(randomNumber)
					}

					chooseQuestions.forEach(num =>
						chosenQuestions.push(questions[num])
					)
					return res.json({ valid: true, questions: chosenQuestions })
				})
				.catch(err => {
					console.error(err)
					return res.status(500).json({ error: err.code })
				})
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}

exports.receiveUserAnswers = (req, res) => {
	const { userId, answers } = req.body

	let questions = []
	let correct = []

	db.collection('questions')
		.get()
		.then(data => {
			data.forEach(doc => {
				questions.push({ id: doc.id, ...doc.data() })
			})

			answers.forEach(answer => {
				let correctAns = questions
					.filter(question => {
						if (answer.question === question.id) return true
						else return false
					})[0]
					.answers.filter(ans => {
						if (ans.isTrue) return true
						else return false
					})[0]

				if (correctAns.id.toString() === answer.answer.toString()) {
					correct.push(answer)
				}
			})

			return db
				.collection('users')
				.where('userId', '==', userId)
				.get()
		})
		.then(data => {
			return new Promise(resolve => {
				let promises = []
				data.forEach(async doc => {
					const appConfig = await getAppConfig()
					const newFields = {
						questionsNumber: appConfig.questionsNumber,
						score: correct.length,
						answers,
						rank: -1
					}

					promises.push(doc.ref.update(newFields))
				})

				resolve(Promise.all(promises))
			})
		})
		.then(async () => {
			await sleep(1000)
			return db
				.collection('users')
				.orderBy('score', 'desc')
				.get()
		})
		.then(async data => {
			await updateRankList(data)
			return db
				.collection('users')
				.where('userId', '==', userId)
				.get()
		})
		.then(data => {
			let myDoc = {}
			data.forEach(doc => {
				myDoc = doc.data()
			})
			if ('answers' in myDoc) {
				delete myDoc.answers
			}
			return res.json(myDoc)
		})
		.catch(err => {
			console.error(err)
			return res.status(500).json({ error: err.code })
		})
}
