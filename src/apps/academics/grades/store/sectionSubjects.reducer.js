import * as Actions from './sectionSubjects.actions';

const initialState = {
    loading: false,
};

const common = function (state = initialState, action) {
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
        case Actions.SET_SECTION_SUBJECTS: {
            return {
                ...state,
                items: [...action.payload],
            };
        }
        case Actions.SET_SECTION_SUBJECT_DETAILS: {
            return {
                ...state,
                item: {...action.payload},
            };
        }
        default:
        {
            return state;
        }
    }
};

export default common;