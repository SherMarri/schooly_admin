import * as Actions from '../actions/auth.actions';
const initialState = getInitialState()

function getInitialState() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return {
            user:user
        };
    }
    else return {
        user: {role: 'Guest'}
    };
}

const auth = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.LOADING:
        {
            return {
                ...state,
                loading: true,
                errors: null
            }
        }
        case Actions.SET_ERRORS:
        {
            return {
                ...state,
                loading: false,
                errors: action.payload
            }
        }
        case Actions.SET_USER_DATA:
        {
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('jwt_token', action.payload.token);
            return {
                ...state,
                loading: false,
                errors: null,
                user: action.payload.user
            }
        }
        default:
        {
            return state
        }
    }
};

export default auth;
