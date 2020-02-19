import {
    GET_ADMIN_QUESTIONS,
    DELETE_QUESTION,
    ADD_QUESTION,
    GET_QUESTION,
    QUESTION_ERROR,
    EDIT_QUESTION,
    GET_RANKLIST,
    LOGOUT
} from '../actions/types';

const initialState = {
    adminQuests: [],
    loading: true,
    question: {},
    rankList: [],
    validQuestion: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_ADMIN_QUESTIONS:
        case ADD_QUESTION:
            return {
                adminQuests: payload.questions,
                loading: false
            };
        case DELETE_QUESTION:
            return {
                adminQuests: state.adminQuests.filter(
                    question => question.id !== payload.deleteId
                )
            };
        case GET_QUESTION:
            return {
                ...state,
                question: payload,
                validQuestion: true,
                loading: false
            };
        case QUESTION_ERROR:
            return {
                ...state,
                validQuestion: false,
                loading: false
            };
        case EDIT_QUESTION:
            return {
                ...state,
                adminQuests: payload.questions,
                loading: false
            };
        case GET_RANKLIST:
            return {
                ...state,
                rankList: payload,
                loading: false
            };
        case LOGOUT:
            return {
                ...state,
                adminQuests: [],
                rankList: [],
                loading: false
            };
        default:
            return state;
    }
}
