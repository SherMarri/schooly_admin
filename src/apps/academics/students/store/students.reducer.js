import * as Actions from './students.actions';

const initialState = {
    loading: false,
};

const common = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.ACTION_INIT: {
            return {
                ...state,
                loading: true,
            };
        }
        case Actions.STUDENT_DETAILS_ACTION_INIT: {
            return {
                ...state,
                student_details_loading: true,
            };
        }
        case Actions.STUDENT_RESULT_ACTION_INIT: {
            return {
                ...state,
                student_result_loading: true,
            };
        }
        case Actions.STUDENT_ATTENDANCE_ACTION_INIT: {
            return {
                ...state,
                student_attendance_loading: true,
            };
        }
        case Actions.EXAM_DETAILS_ACTION_INIT: {
            return {
                ...state,
                exam_details_loading: true,
            };
        }
        case Actions.EXAM_DETAILS_ACTION_SUCCESS: {
            return {
                ...state,
                exam_details_loading: false,
            };
        }
        case Actions.STUDENT_RESULT_ACTION_SUCCESS: {
            return {
                ...state,
                student_result_loading: false,
            };
        }
        case Actions.STUDENT_DETAILS_ACTION_SUCCESS: {
            return {
                ...state,
                student_details_loading: false,
            };
        }
        case Actions.STUDENT_ATTENDANCE_ACTION_SUCCESS: {
            return {
                ...state,
                student_attendance_loading: false,
            };
        }
        case Actions.ACTION_SUCCESS: {
            return {
                ...state,
                loading: false,
            };
        }
        case Actions.EXAM_DETAILS_ACTION_FAILURE: {
            return {
                ...state,
                exam_details_loading: false,
            };
        }
        case Actions.ACTION_FAILURE: {
            return {
                ...state,
                loading: false,
            };
        }
        case Actions.STUDENT_DETAILS_ACTION_FAILURE: {
            return {
                ...state,
                student_details_loading: false,
            };
        }
        case Actions.STUDENT_RESULT_ACTION_FAILURE: {
            return {
                ...state,
                student_result_loading: false,
            };
        }
        case Actions.STUDENT_ATTENDANCE_ACTION_FAILURE: {
            return {
                ...state,
                student_attendance_loading: false,
            };
        }
        case Actions.SET_FILTERS: {
            return {
                ...state,
                filter_form: action.payload,
                details: null,
            };
        }
        case Actions.SET_DETAILS: {
            return {
                ...state,
                details: {
                    ...action.payload
                }
            };
        }
        case Actions.SET_STUDENT_DETAILS: {
            return {
                ...state,
                student_details: {
                    ...action.payload
                }
            };
        }
        case Actions.SET_STUDENT_RESULT: {
            return {
                ...state,
                student_result: {
                    ...action.payload
                }
            };
        }
        case Actions.SET_STUDENT_EXAMS: {
            return {
                ...state,
                student_exams: {
                    ...action.payload
                }
            };
        }
        case Actions.SET_STUDENT_ATTENDANCE: {
            return {
                ...state,
                student_attendance: [
                    ...action.payload
                ]
            };
        }
        case Actions.SET_STUDENT_EXAM_DETAILS: {
            return {
                ...state,
                student_exam_details: {
                    ...action.payload
                }
            };
        }
        case Actions.FETCHING_STUDENT_RESULT_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: action.payload
            };
        }
        case Actions.SET_STUDENTS_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: false,
                download_url: action.payload 
            };
        }
        case Actions.CLEAR_STUDENTS_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: false,
                download_url: null, 
            };
        }
        default:
        {
            return state;
        }
    }
};

export default common;