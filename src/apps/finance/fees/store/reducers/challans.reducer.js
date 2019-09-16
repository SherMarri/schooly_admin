import * as Actions from '../actions/challans.actions';

const initialState = {
    item_status: Actions.IDLE,
    filter_form: {
        from: null,
        to: null,
        target_type: 'group',
        target_value: null,
        status: null,
    }
};

const challans = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.FETCHING_CHALLANS:
        {
            return {
                ...state,
                loading: true
            };
        }
        case Actions.SET_CHALLANS:
        {
            return {
                ...state,
                loading: false,
                ...action.payload
            };   
        }
/*
        case Actions.UPDATE_ITEM_STATUS:
        {
            return {
                ...state,
                item_status: action.payload
            };
        }
*/
        case Actions.UPDATE_ITEM:
        {
            const item = action.payload;
            const new_list = state.data.map(d => {
                return d.id === item.id ? item : d;
            });
            return {
                ...state,
                data: new_list,
            };
        }
        case Actions.SET_FILTERS:
        {
            return {
                ...state,
                filter_form: action.payload
            };
        }
        case Actions.FETCHING_DOWNLOAD_LINK: {
            return {
                ...state,
                fetching_download_link: action.payload
            };
        }
        case Actions.SET_DOWNLOAD_LINK: {
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
            return state;
        }
    }
};

export default challans;