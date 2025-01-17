import * as Actions from '../actions/auth.actions';

const guestUser = {
    role: 'Guest',
}
function getInitialState() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return {
            user:user,
        };
    }
    else return {
        user: {
            ...guestUser
        },
    };
}

const initialState = getInitialState()

const auth = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.LOADING:
        {
            return {
                ...state,
                loading: action.payload,
            };
        }
        case Actions.SET_USER_DATA:
        {
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('jwt_token', action.payload.token);
            return {
                ...state,
                user: action.payload.user
            }
        }
        case Actions.CLEAR_USER_DATA:
        {
            localStorage.removeItem('user');
            localStorage.removeItem('jwt_token');
            return {
                user: {
                    ...guestUser,
                },
            };
        }
        default:
        {
            return state
        }
    }
};

export default auth;
