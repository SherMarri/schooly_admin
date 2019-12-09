import * as Actions from '../actions/roles.actions';

const initialState = {
    loading: false,
};

const roles = function (state = initialState, action) {
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
        case Actions.ROLE_DIALOG_ACTION_INIT: {
            return {
                ...state,
                role_dialog_loading: true,
            };
        }
        case Actions.ROLE_DIALOG_ACTION_SUCCESS: {
            return {
                ...state,
                role_dialog_loading: false,
            };
        }
        case Actions.ROLE_DIALOG_ACTION_FAILURE: {
            return {
                ...state,
                role_dialog_loading: false,
            };
        }
        case Actions.SET_ROLES: {
            return {
                ...state,
                details: [
                    ...action.payload,
                ],
            };
        }
        case Actions.SET_USERS_BY_ROLE: {
            return {
                ...state,
                users_by_role: [
                    ...action.payload,
                ],
            };
        }
        default:
        {
            return state;
        }
    }
};

export default roles;