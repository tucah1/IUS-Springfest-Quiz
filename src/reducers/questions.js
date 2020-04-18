import {
    IMPORT_QUESTIONS,
    CLEAR_QUESTIONS,
    GET_RESULTS,
    CHANGE_SETTINGS,
    GET_SETTINGS
} from '../actions/types';

const initialState = {
    questions: [],
    loading: true,
    validUser: null,
    resultsLoading: true,
    questionsImporting: true,
    settings: {
        questionsNumber: null,
        timer: null,
        isBlocked: null,
        isRankListVisible: null
    },
    results: {},
    errors: {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case IMPORT_QUESTIONS:
            return {
                ...state,
                questions: payload.questions,
                validUser: payload.valid,
                questionsImporting: false,
                loading: false
            };
        case CLEAR_QUESTIONS:
            return {
                ...state,
                questions: [],
                errors: {},
                loading: false,
                validUser: null,
                resultsLoading: true,
                results: {}
            };
        case GET_RESULTS:
            return {
                ...state,
                results: payload,
                loading: false,
                resultsLoading: false
            };
        case CHANGE_SETTINGS:
        case GET_SETTINGS:
            return {
                ...state,
                settings: {
                    questionsNumber: Number(payload.questionsNumber),
                    timer: Number(payload.timeForQuiz),
                    isBlocked: payload.isQuizBlocked,
                    isRankListVisible: payload.isRankListVisible
                },
                loading: false
            };
        default:
            return state;
    }
}
