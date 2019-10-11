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
                items: {...action.payload},
            };
        }
        case Actions.SET_ATTENDANCE_DETAILS: {
            return {
                ...state,
                daily_attendance: {...action.payload},
            };
        }
        default:
        {
            return state;
        }
    }
};

export default common;