import { UrlService, Utils } from "../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../core/store/actions/common.actions";
import { PROFILE_TYPES } from "../../../../core/constants";

export const ACTION_INIT = '[STAFF] STAFF ACTION INIT';
export const ACTION_SUCCESS = '[STAFF] STAFF ACTION SUCCESS';
export const ACTION_FAILURE = '[STAFF] STAFF ACTION FAILURE';
export const CLEAR_TABLE_DATA = '[STAFF] STAFF CLEAR TABLE DATA';

export const SET_FILTERS = '[STAFF] STAFF SET FILTERS';
export const SET_DETAILS = '[STAFF] STAFF SET DETAILS';

export const SET_TEACHERS = '[STAFF] STAFF SET TEACHERS';

export const FETCHING_STAFF_DOWNLOAD_LINK = '[STAFF] STAFF FETCHING DOWNLOAD LINK';
export const SET_STAFF_DOWNLOAD_LINK = '[STAFF] STAFF SET DOWNLOAD LINK';
export const CLEAR_STAFF_DOWNLOAD_LINK = '[STAFF] STAFF CLEAR DOWNLOAD LINK';

export function addUpdateStaff(data, filter_form, update=false) {
    return (dispatch) => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.post('users/staff', data)
        .then(response => {
            dispatch({
                type: ACTION_SUCCESS,
            });
            dispatch(fetchDetails(filter_form));
            dispatch(toggleSnackbar({
                message: `Staff ${update ? 'updated' : 'registered'} successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch({
                type: ACTION_FAILURE,
            });
            dispatch(toggleSnackbar({
                message: 'Unable to register staff, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}

export function updateFilters(filters) {
    return dispatch => {
        dispatch({
            type: CLEAR_TABLE_DATA,
        });
        return dispatch(fetchDetails(filters));
    }
}

export function setFilters(filters) {
    return dispatch => {
        return dispatch({
            type: SET_FILTERS,
            payload: filters,
        });
    }
}

export function fetchDetails(params) {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        dispatch(setFilters(params));
        UrlService.get('users/staff', params)
        .then(response => {
            dispatch({
                type: SET_DETAILS,
                payload: response.data
            });
            dispatch({
                type: ACTION_SUCCESS
            });
        })
        .catch(error => {
            dispatch({
                type: ACTION_FAILURE
            });
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}

export function fetchTeachers() {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        let filters = {dropdown: true, profile_type: PROFILE_TYPES.TEACHER};
        UrlService.get('users/staff', filters)
        .then(response => {
            dispatch({
                type: SET_TEACHERS,
                payload: response.data
            });
            dispatch({
                type: ACTION_SUCCESS
            });
        })
        .catch(error => {
            dispatch({
                type: ACTION_FAILURE
            });
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}

export function clearDownloadLink() {
    return dispatch => {
        return dispatch({
            type: CLEAR_STAFF_DOWNLOAD_LINK,
        });
    }
}

export function deactivateStaff(params, filter_form) {
    return dispatch => {
        UrlService.delete(`users/staff`, params)
        .then(response => {
            dispatch(fetchDetails(filter_form));
            dispatch(toggleSnackbar({
                message: 'Staff terminated successfully.',
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}

export function fetchDownloadLink(params) {
    return dispatch => {
        let filters = params;
        if (params.start_date) {
            filters.start_date = Utils.formatDate(params.start_date); 
        }
        if (params.end_date) {
            filters.end_date = Utils.formatDate(params.end_date); 
        }
        dispatch({
            type: FETCHING_STAFF_DOWNLOAD_LINK,
            payload: true,
        });
        UrlService.get('users/staff', filters)
        .then(response => {
            const download_url = `${UrlService.getUrl('downloadcsv')}?file_name=${response.data}`;
            dispatch({
                type: SET_STAFF_DOWNLOAD_LINK,
                payload: download_url
            });
        })
        .catch(error => {
            dispatch({
                type: FETCHING_STAFF_DOWNLOAD_LINK,
                payload: false,
            });
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}