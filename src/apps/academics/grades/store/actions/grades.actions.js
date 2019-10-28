import { UrlService } from "../../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] GRADES ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] GRADES ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] GRADES ACTION FAILURE';

export const SET_GRADES = '[ACADEMICS] SET GRADES';
export const SET_GRADE_DETAILS = '[ACADEMICS] SET GRADE DETAILS';

export function createGrade(data) {
    return (dispatch) => {
        UrlService.post('academics/grades', data)
        .then(response => {
            dispatch(fetchGrades());
            dispatch(toggleSnackbar({
                message: `Class created successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to create class, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}

export function updateGrade(grade_id, data) {
    return (dispatch) => {
        UrlService.patch(`academics/grades/${grade_id}`, data)
        .then(response => {
            dispatch(fetchGrades());
            dispatch(toggleSnackbar({
                message: `Class updated successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to update class, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}

export function fetchGrades() {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get('academics/grades', {summary: true})
        .then(response => {
            dispatch({
                type: SET_GRADES,
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
                message: 'Unable to retrieve classes, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}

export function fetchGradeDetails(grade_id) {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`academics/grades/${grade_id}`, {summary: true})
        .then(response => {
            dispatch({
                type: SET_GRADE_DETAILS,
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
                message: 'Unable to retrieve classes, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}

export function deleteGrade(grade_id) {
    return dispatch => {
        UrlService.delete(`academics/grades/${grade_id}`)
        .then(response => {
            dispatch(fetchGrades());
            dispatch(toggleSnackbar({
                message: 'Class deleted successfully.',
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
