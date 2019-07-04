import * as Actions from '../actions/common.actions';

function getInitialState() {
    return {
        snackbar: {
            open: false,
            message: null,
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
                    message: action.payload
                }
            }
        }
        default:
        {
            return state
        }
    }
};

export default common;