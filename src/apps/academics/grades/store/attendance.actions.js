import { UrlService } from "../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] ATTENDANCE ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] ATTENDANCE ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] ATTENDANCE ACTION FAILURE';

export const ACTION_FETCH_DAILY_ATTENDANCE_INIT = '[ACADEMICS] FETCH DAILY ATTENDANCE ACTION INIT';
export const ACTION_FETCH_DAILY_ATTENDANCE_SUCCESS = '[ACADEMICS] FETCH DAILY ATTENDANCE ACTION SUCCESS';
export const ACTION_FETCH_DAILY_ATTENDANCE_FAILURE = '[ACADEMICS] FETCH DAILY ATTENDANCE ACTION FAILURE';

export const SET_ATTENDANCE = '[ACADEMICS] SET ATTENDANCE';
export const SET_ATTENDANCE_DETAILS = '[ACADEMICS] SET ATTENDANCE DETAILS';

export function createAttendance(data) {
    return (dispatch) => {
        UrlService.post(`attendance/students/daily`, data)
            .then(response => {
                dispatch(fetchAttendance());
                dispatch(toggleSnackbar({
                    message: `Attendance created successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                dispatch(toggleSnackbar({
                    message: 'Unable to create attendance, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    };
}

export function updateAttendance(data) {
    return (dispatch) => {
        UrlService.post(`attendance`, data)
            .then(response => {
                dispatch(fetchAttendance());
                dispatch(toggleSnackbar({
                    message: `Attendance updated successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                dispatch(toggleSnackbar({
                    message: 'Unable to update attendance, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    };
}

export function fetchAttendance(section_id, page=1) {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`academics/sections/${section_id}/attendance`, {page: page})
            .then(response => {
                dispatch({
                    type: SET_ATTENDANCE,
                    payload: response
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
                    message: 'Unable to retrieve attendance, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function fetchAttendanceDetails(attendance_id) {
    return dispatch => {
        dispatch({
            type: ACTION_FETCH_DAILY_ATTENDANCE_INIT
        });
        UrlService.get(`attendance/students/daily/${attendance_id}`)
            .then(response => {
                dispatch({
                    type: SET_ATTENDANCE_DETAILS,
                    payload: response.data
                });
                dispatch({
                    type: ACTION_FETCH_DAILY_ATTENDANCE_SUCCESS
                });
            })
            .catch(error => {
                dispatch({
                    type: ACTION_FETCH_DAILY_ATTENDANCE_FAILURE
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to retrieve attendance, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function deleteAttendance(attendance_id) {
    return dispatch => {
        UrlService.delete(`attendance/${attendance_id}`)
            .then(response => {
                dispatch(fetchAttendance());
                dispatch(toggleSnackbar({
                    message: 'Attendance deleted successfully.',
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
