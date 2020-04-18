import {
    GET_ADMIN_QUESTIONS,
    DELETE_QUESTION,
    ADD_QUESTION,
    GET_QUESTION,
    QUESTION_ERROR,
    EDIT_QUESTION,
    GET_RANKLIST,
    CHANGE_SETTINGS
} from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getAdminQuestions = () => async dispatch => {
    const config = {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };
    try {
        const res = await axios.get('/admin/questions', config);

        dispatch({
            type: GET_ADMIN_QUESTIONS,
            payload: res.data
        });
    } catch (err) {
        console.log(err);
    }
};

export const addQuestion = quest => async dispatch => {
    const config = {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };

    try {
        const res = await axios.post('/admin/questions', quest, config);

        dispatch({
            type: ADD_QUESTION,
            payload: res.data
        });
        dispatch(setAlert('Question added', 'success'));
    } catch (err) {
        console.log(err);
    }
};

export const deleteQuestion = id => async dispatch => {
    const config = {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };
    try {
        const res = await axios.delete(`/admin/questions/${id}`, config);

        dispatch({
            type: DELETE_QUESTION,
            payload: res.data
        });
        dispatch(setAlert('Question deleted', 'danger'));
    } catch (err) {
        console.log(err);
    }
};

//get single question
export const getSingleQuestion = id => async dispatch => {
    const config = {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };
    try {
        const res = await axios.get(`/admin/questions/${id}`, config);

        dispatch({
            type: GET_QUESTION,
            payload: res.data
        });
    } catch (err) {
        console.log(err);

        dispatch({
            type: QUESTION_ERROR
        });
    }
};

export const editQuestion = (quest, id) => async dispatch => {
    const config = {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };

    try {
        const res = await axios.put(`/admin/questions/${id}`, quest, config);

        dispatch({
            type: EDIT_QUESTION,
            payload: res.data
        });
        dispatch(setAlert('Question edited', 'success'));
    } catch (err) {
        console.log(err);
    }
};

export const getRankList = () => async dispatch => {
    try {
        const res = await axios.get('/admin/rank-list');

        dispatch({
            type: GET_RANKLIST,
            payload: res.data
        });
    } catch (err) {
        console.log(err);
    }
};

export const resetQuiz = () => async dispatch => {
    if (
        window.confirm(
            'Are you sure you want to reset whole quiz. This will delete all questions, users and their scores. This action cannot be undone!'
        )
    ) {
        const config = {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        };

        try {
            await axios.delete('/admin/reset-quiz', config);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
};

export const changeSettings = obj => async dispatch => {
    const config = {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };

    try {
        const res = await axios.post('/admin/config', obj, config);

        dispatch({
            type: CHANGE_SETTINGS,
            payload: res.data
        });

        window.location.reload();
        dispatch(setAlert('Settings updated!', 'success', 5));
    } catch (err) {
        console.log(err);
    }
};

//send file with questions to server and update datebase with new questions
export const sendFile = file => async dispatch => {
    const config = {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };

    const formData = new FormData();
    formData.append('file', file);

    try {
        await axios.post(
            'https://cors-anywhere.herokuapp.com/https://europe-west1-ius-springfest-quiz.cloudfunctions.net/api/admin/questions-file',
            formData
        );
    } catch (err) {
        console.log(err);
        console.log(err.response);
    }
};

// https://europe-west1-ius-springfest-quiz.cloudfunctions.net/api  https://cors-anywhere.herokuapp.com/https://europe-west1-ius-springfest-quiz.cloudfunctions.net/api
