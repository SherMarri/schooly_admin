import * as Actions from '../actions/common.actions';

const initialState = {
    filter_form: {
        start_date: null,
        end_date: null,
        category_id: null,
    },
    loading: false,
};

const common = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.FETCH_CATEGORIES: {
            return {
                ...state,
                categories: action.payload
            }
        }
        case Actions.SET_SUMMARY: {
            return {
                ...state,
                summary: action.payload
            };
        }
        case Actions.SET_LOADING: {
            return {
                ...state,
                loading: action.payload
            };
        }
        case Actions.SET_FILTERS: {
            return {
                ...state,
                filter_form: action.payload
            };
        }
        case Actions.CLEAR_REPORTS_DATA: {
            return {
                ...state,
                details: null,
            }
        }
        case Actions.SET_DETAILS: {
            let category_wise_data = null;
            if (state.details && state.details.category_wise_data) {
                category_wise_data = state.details.category_wise_data;
            }
            return {
                ...state,
                details: {
                    category_wise_data: category_wise_data,
                    ...action.payload
                }
            }
        }
        case Actions.FETCHING_INCOME_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: action.payload
            };
        }
        case Actions.SET_INCOME_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: false,
                download_url: action.payload
            };
        }
        case Actions.CLEAR_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: false,
                download_url: null,
            };
        }
        default:
        {
            return state
        }
    }
};

export default common;