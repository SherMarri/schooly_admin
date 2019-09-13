import * as Actions from '../actions/daily-income.actions';

const initialState = {
    loading: true,
    income_item_status: Actions.IDLE,
    items: []
};

const daily = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.FETCHING_DAILY_INCOME: {
            return {
                ...state,
                loading: true
            }
        }
        case Actions.SET_DAILY_INCOME: {
            return {
                ...state,
                loading: false,
                items: action.payload
            }
        }
        case Actions.ADD_INCOME_ITEM: {
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