import * as Actions from '../actions/common.actions';

function getInitialState() {
    return {
        snackbar: {
            open: false,
            message: null,
            variant: null,
        }
    };
}

const initialState = getInitialState()

const common = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.TOGGLE_SNACKBAR:
        {
            return {
                ...state,
                snackbar: {
                    open: !state.snackbar.open,
                    message: action.payload.message,
                    variant: action.payload.variant,
                }
            }
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
            return state
        }
    }
};

export default common;