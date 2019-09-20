import * as Actions from './subjects.actions';

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
        case Actions.SET_SUBJECTS: {
            return {
                ...state,
                items: [...action.payload],
            };
        }
        default:
        {
            return state;
        }
    }
};

export default common;