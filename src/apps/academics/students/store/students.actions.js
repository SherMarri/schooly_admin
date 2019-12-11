import { UrlService, Utils } from "../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] STUDENTS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] STUDENTS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] STUDENTS ACTION FAILURE';
export const CLEAR_TABLE_DATA = '[ACADEMICS] STUDENTS CLEAR TABLE DATA';

export const SET_FILTERS = '[ACADEMICS] STUDENTS SET FILTERS';
export const SET_DETAILS = '[ACADEMICS] STUDENTS SET DETAILS';

export const FETCHING_STUDENTS_DOWNLOAD_LINK = '[ACADEMICS] STUDENTS FETCHING DOWNLOAD LINK';
export const SET_STUDENTS_DOWNLOAD_LINK = '[ACADEMICS] STUDENTS SET DOWNLOAD LINK';
export const CLEAR_STUDENTS_DOWNLOAD_LINK = '[ACADEMICS] STUDENTS CLEAR DOWNLOAD LINK';

export function addUpdateStudent(data, update=false) {
    return (dispatch, getState) => {
        const filter_form = getState().academics.students.filter_form;
        dispatch({
            type: ACTION_INIT
        });
        UrlService.post('users/students', data)
        .then(response => {
            dispatch({
                type: ACTION_SUCCESS,
            });
            dispatch(fetchDetails(filter_form));
            dispatch(toggleSnackbar({
                message: `Student ${update ? 'updated' : 'registered'} successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch({
                type: ACTION_FAILURE,
            });
            dispatch(toggleSnackbar({
                message: 'Unable to register student, please contact Schooli support.',
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
        let filters = params;
        dispatch(setFilters(filters));
        if (params.start_date) {
            filters.start_date = Utils.formatDate(params.start_date); 
        }
        if (params.end_date) {
            filters.end_date = Utils.formatDate(params.end_date); 
        }
        UrlService.get('users/students', filters)
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

export function clearDownloadLink() {
    return dispatch => {
        return dispatch({
            type: CLEAR_STUDENTS_DOWNLOAD_LINK,
        });
    }
}

export function deactivateStudent(params, filter_form) {
    return dispatch => {
        UrlService.delete(`users/students`, params) 
        .then(response => {
            dispatch(fetchDetails(filter_form));
            dispatch(toggleSnackbar({
                message: 'Student terminated successfully.',
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
            type: FETCHING_STUDENTS_DOWNLOAD_LINK,
            payload: true,
        });
        UrlService.get('users/students', filters)
        .then(response => {
            const download_url = `${UrlService.getUrl('download_csv')}?file_name=${response.data}`;
            dispatch({
                type: SET_STUDENTS_DOWNLOAD_LINK,
                payload: download_url
            });
        })
        .catch(error => {
            dispatch({
                type: FETCHING_STUDENTS_DOWNLOAD_LINK,
                payload: false,
            });
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}