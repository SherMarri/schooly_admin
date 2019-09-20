import { UrlService, Utils } from "../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] SUBJECTS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] SUBJECTS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] SUBJECTS ACTION FAILURE';
export const CLEAR_TABLE_DATA = '[ACADEMICS] SUBJECTS CLEAR TABLE DATA';

export const SET_SUBJECTS = '[ACADEMICS] SUBJECTS SET DETAILS';

export function createSubject(data) {
    return (dispatch) => {
        UrlService.post('academics/subjects', data)
        .then(response => {
            dispatch(toggleSnackbar({
                message: `Subject created successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to create subject, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}

export function updateSubject(subject_id, data) {
    return (dispatch) => {
        UrlService.put(`academics/subjects/${subject_id}`, data)
        .then(response => {
            dispatch(toggleSnackbar({
                message: `Subject updated successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to update subject, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}

export function fetchSubjects() {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get('academics/subjects')
        .then(response => {
            dispatch({
                type: SET_SUBJECTS,
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
                message: 'Unable to retrieve subjects, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}

export function deleteSubject(subject_id) {
    return dispatch => {
        UrlService.delete(`academics/subjects/${subject_id}`) 
        .then(response => {
            dispatch(toggleSnackbar({
                message: 'Subject deleted successfully.',
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
