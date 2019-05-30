import * as Actions from '../actions/common.actions';

const initialState = {
};

const common = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.FETCH_CATEGORIES: {
            return {
                ...state,
                categories: action.payload
            }
        }
        default:
        {
            return state
        }
    }
};

export default common;