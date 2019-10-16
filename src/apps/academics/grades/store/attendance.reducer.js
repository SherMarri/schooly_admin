import * as Actions from './attendance.actions';

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
                section_attendance: null,
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
        case Actions.ACTION_FETCH_DAILY_ATTENDANCE_INIT: {
            return {
                ...state,
                loading_daily_attendance: true,
            };
        }
        case Actions.ACTION_FETCH_DAILY_ATTENDANCE_SUCCESS: {
            return {
                ...state,
                loading_daily_attendance: false,
            };
        }
        case Actions.ACTION_FETCH_DAILY_ATTENDANCE_FAILURE: {
            return {
                ...state,
                loading_daily_attendance: false,
            };
        }
        case Actions.SET_ATTENDANCE: {
            return {
                ...state,
                section_attendance: {...action.payload},
            };
        }
        case Actions.SET_ATTENDANCE_DETAILS: {
            return {
                ...state,
                daily_attendance: {...action.payload},
            };
        }
        case Actions.RESET_DAILY_ATTENDANCE_DATA: {
            return {
                ...state,
                daily_attendance: null,
                loading_daily_attendance: null,
            };
        }
        case Actions.SET_FILTERS: {
            return {
                ...state,
                filter_form: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
};

export default common;