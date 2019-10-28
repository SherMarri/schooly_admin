import * as Actions from '../actions/grades.actions';

const initialState = {
    loading: false,
};

const items = function (state = initialState, action) {
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
        case Actions.SET_GRADES: {
            return {
                ...state,
                details: {...action.payload},
            };
        }
        case Actions.SET_GRADE_DETAILS: {
            return {
                ...state,
                item: {...action.payload},
            };
        }
        default:
        {
            return state;
        }
    }
};

export default items;
