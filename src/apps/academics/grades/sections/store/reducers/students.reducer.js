import * as Actions from '../actions/students.actions';

const initialState = {
    loading: false,
};

const students = function (state = initialState, action) {
    switch (action.type) {
        case Actions.ACTION_INIT: {
            return {
                ...state,
                loading: true,
            };
        }
        case Actions.ACTION_SUCCESS: {
            return {
                ...state,
                loading: false,
            };
        }
        case Actions.ACTION_FAILURE: {
            return {
                ...state,
                loading: false,
            };
        }
        case Actions.SET_SECTION_STUDENTS: {
            return {
                ...state,
                items: [...action.payload],
            };
        }
        case Actions.FETCHING_SECTION_STUDENTS_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: action.payload
            };
        }
        case Actions.SET_SECTION_STUDENTS_DOWNLOAD_LINK : {
            return {
                ...state,
                fetching_download_link: false,
                download_url: action.payload
            }
        }
        case Actions.CLEAR_SECTION_STUDENTS_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: false,
                download_url: null,
            };
        }

        default: {
            return state;
        }
    }
};

export default students;