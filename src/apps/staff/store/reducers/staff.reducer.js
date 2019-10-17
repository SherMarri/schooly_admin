import * as Actions from '../actions/staff.actions';

const initialState = {
    loading: false,
};

const staff = function (state = initialState, action) {
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
        case Actions.SET_FILTERS: {
            return {
                ...state,
                filter_form: action.payload,
                details: null,
            };
        }
        case Actions.SET_DETAILS: {
            return {
                ...state,
                details: [
                    ...action.payload
                ]
            };
        }
        case Actions.FETCHING_STAFF_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: action.payload
            };
        }
        case Actions.SET_STAFF_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: false,
                download_url: action.payload 
            };
        }
        case Actions.CLEAR_STAFF_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: false,
                download_url: null, 
            };
        }
        default:
        {
            return state;
        }
    }
};

export default staff;