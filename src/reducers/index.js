import { combineReducers } from 'redux';
import questions from './questions';
import auth from './auth';
import adminQuestions from './adminQuestions';
import alert from './alert';

export default combineReducers({
    auth,
    questions,
    adminQuestions,
    alert
});
