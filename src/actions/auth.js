import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_QUESTIONS,
    ADMIN_LOADED,
    AUTH_ERROR
} from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const loadAdmin = () => async dispatch => {
    const config = {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };

    try {
        const res = await axios.get('/admin/load', config);

        dispatch({
            type: ADMIN_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
};

export const login = (email, password) => async dispatch => {
    try {
        const res = await axios.post('/admin/login', {
            email: email,
            password: password
        });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        console.log(err);

        const errors = err.response.data.message;

        dispatch(setAlert(errors, 'danger'));
        dispatch({
            type: LOGIN_FAIL
        });
    }
};

export const logout = () => async dispatch => {
    const config = {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };
    try {
        await axios.get('/admin/logout', config);

        dispatch({
            type: LOGOUT
        });
        dispatch({
            type: CLEAR_QUESTIONS
        });
    } catch (err) {
        console.log(err);
    }
};
