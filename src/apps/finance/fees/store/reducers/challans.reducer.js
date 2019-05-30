import * as Actions from '../actions/challans.actions';

const initialState = {
};

const challans = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.UPDATE_ITEM_STATUS:
        {
            return {
                ...state,
                item_status: action.payload
            };
        }
        case Actions.SET_GRADES:
        {
            return {
                ...state,
                grades: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
};

export default challans;