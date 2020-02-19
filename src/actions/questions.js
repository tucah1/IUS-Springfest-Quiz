import axios from 'axios';
import {
    IMPORT_QUESTIONS,
    CLEAR_QUESTIONS,
    GET_RESULTS,
    GET_SETTINGS
} from '../actions/types';

// Check is scanned ID valid and import questions
export const checkIDandImportQuestions = id => async dispatch => {
    dispatch({
        type: CLEAR_QUESTIONS
    });

    try {
        const res = await axios.post('/questions', { userId: id });

        if (res.data.valid) {
            localStorage.setItem('user', id);
        }
        dispatch({
            type: IMPORT_QUESTIONS,
            payload: res.data
        });
    } catch (err) {
        console.log(err);
    }
};

export const getResults = answers => async dispatch => {
    try {
        const res = await axios.post('/questions/score', answers);

        dispatch({
            type: GET_RESULTS,
            payload: res.data
        });
    } catch (err) {
        console.log(err);
    }
};

// clear questions from state
export const clearQuestions = () => async dispatch => {
    dispatch({
        type: CLEAR_QUESTIONS
    });
};

export const getSettings = () => async dispatch => {
    try {
        const res = await axios.get('/admin/config');

        dispatch({
            type: GET_SETTINGS,
            payload: res.data
        });
    } catch (err) {
        console.log(err);
    }
};
