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
                expense_item_status: Actions.SUCCESSFUL
            }
        }
        case Actions.DELETE_EXPENSE_ITEM: {
            const items = state.items.filter(i => i.id !== action.payload);
            return {
                ...state,
                items
            };
        }
        case Actions.UPDATE_EXPENSE_ITEM_STATUS: {
            return {
                ...state,
                expense_item_status: action.payload
            }
        }
        default:
        {
            return state
        }
    }
};

export default daily;