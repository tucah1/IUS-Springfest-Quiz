exports.sortQuestions = questions => {
	return questions.sort((a, b) =>
		a.createdAt.trim() < b.createdAt.trim() ? 1 : -1
	)
}

exports.sortUsersByScore = users => {
	usersArr = users.docs.map(user => user.data())
	return usersArr.sort((a, b) => {
		return b.score - a.score
	})
}

exports.sortArrayByScore = arr => {
	return arr.sort((a, b) => {
		a.score < b.score ? 1 : -1
	})
}

exports.findIndexByUserId = (users, userId) => {
	let index = 0
	let counter = 0
	let flag = false
	users.forEach(user => {
		if (user.userId === userId && !flag) {
			index = counter
			flag = true
		}
		counter += 1
	})
	return index
}

exports.updateRankList = data => {
	return new Promise(resolve => {
		const promises = []
		let index = 0

		data.forEach(doc => {
			promises.push(doc.ref.update({ rank: index + 1 }))
			index += 1
		})
		resolve(Promise.all(promises))
	})
}

exports.isNumber = number => {
	return !isNaN(parseFloat(number)) && !isNaN(number - 0)
}

exports.checkLoginTime = loggedInAt => {
	const now = new Date()
	const loginTime = loggedInAt.toDate()
	const diff = now.getTime() - loginTime.getTime()

	return diff < 60 * 60 * 1000
}

exports.sleep = ms => {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}
