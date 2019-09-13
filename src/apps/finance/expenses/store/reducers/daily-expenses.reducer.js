import * as Actions from '../actions/daily-expenses.actions';

const initialState = {
    loading: true,
    expense_item_status: Actions.IDLE,
    items: []
};

const daily = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.FETCHING_DAILY_EXPENSES: {
            return {
                ...state,
                loading: true
            }
        }
        case Actions.SET_DAILY_EXPENSES: {
            return {
                ...state,
                loading: false,
                items: action.payload
            }
        }
        case Actions.ADD_EXPENSE_ITEM: {
            return {
                ...state,
                loading: false,
                items: [action.payload,...state.items],
            }
        }
        default:
        {
            return state
        }
    }
};

export default daily;