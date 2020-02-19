const functions = require('firebase-functions')
const app = require('express')()
const { getUserQuestions, receiveUserAnswers } = require('./routes/quiz')
const {
	adminLogin,
	adminLoad,
	getTheRankList,
	resetQuiz,
	postConfig,
	getConfig,
	adminLogout,
	deleteQuestion,
	editQuestion,
	getSingleQuestion,
	postNewQuestion,
	getAllQuestions,
	addQuestionsFromFile
} = require('./routes/admin')
const auth = require('./util/auth')
const cors = require('cors')

app.use(cors())

app.post('/questions', getUserQuestions)
app.post('/questions/score', receiveUserAnswers)
app.post('/admin/questions', auth, postNewQuestion)
app.put('/admin/questions/:questionId', auth, editQuestion)
app.get('/admin/questions', auth, getAllQuestions)
app.get('/admin/questions/:questionId', auth, getSingleQuestion)
app.delete('/admin/questions/:deleteId', auth, deleteQuestion)

app.post('/admin/login', adminLogin)
app.post('/admin/config', auth, postConfig)
app.get('/admin/config', getConfig)
app.get('/admin/load', auth, adminLoad)
app.get('/admin/rank-list', getTheRankList)
app.delete('/admin/reset-quiz', auth, resetQuiz)
app.get('/admin/logout', auth, adminLogout)
app.post('/admin/questions-file', auth, addQuestionsFromFile)

exports.api = functions.region('europe-west1').https.onRequest(app)
