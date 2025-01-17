import * as Actions from '../actions/assessments.actions';

const initialState = {
    loading: false,
};

const assessments = function (state = initialState, action) {
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
        case Actions.SET_SECTION_ASSESSMENTS: {
            return {
                ...state,
                items: {...action.payload},
            };
        }
        case Actions.SET_EXAM_ASSESSMENTS: {
            return {
                ...state,
                exam_assessments: [...action.payload],
            };
        }
        case Actions.FETCHING_SECTION_ASSESSMENTS_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: action.payload
            };
        }
        case Actions.SET_SECTION_ASSESSMENTS_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: false,
                download_url: action.payload
            };
        }
        case Actions.CLEAR_SECTION_ASSESSMENTS_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: false,
                download_url: null,
            };
        }
        case Actions.SET_FILTERS: {
            return {
                ...state,
                filter_form: action.payload
            };
        }
        case Actions.ACTION_FETCH_ASSESSMENT_DETAILS_INIT: {
            return {
                ...state,
                loading_assessment_details: true,
            };
        }
        case Actions.ACTION_FETCH_ASSESSMENT_DETAILS_SUCCESS: {
            return {
                ...state,
                loading_assessment_details: false,
            };
        }
        case Actions.ACTION_FETCH_ASSESSMENT_DETAILS_FAILURE: {
            return {
                ...state,
                loading_assessment_details: false,
            };
        }
        case Actions.SET_SECTION_ASSESSMENT_DETAILS: {
            return {
                ...state,
                assessment_details: {...action.payload},
            };
        }
        case Actions.RESET_ASSESSMENT_DETAILS: {
            return {
                ...state,
                assessment_details: null,
            };
        }
        case Actions.CLEAR_TABLE_DATA: {
            return {
                ...state,
                items: null,
            };
        }
        default: {
            return state;
        }
    }
};

export default assessments;