import { UrlService } from "../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../core/store/actions/common.actions";
import {fetchNotifications} from "./gradeNotifications.actions";

export const ACTION_INIT = '[ACADEMICS] ATTENDANCE ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] ATTENDANCE ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] ATTENDANCE ACTION FAILURE';

export const ACTION_FETCH_DAILY_ATTENDANCE_INIT = '[ACADEMICS] FETCH DAILY ATTENDANCE ACTION INIT';
export const ACTION_FETCH_DAILY_ATTENDANCE_SUCCESS = '[ACADEMICS] FETCH DAILY ATTENDANCE ACTION SUCCESS';
export const ACTION_FETCH_DAILY_ATTENDANCE_FAILURE = '[ACADEMICS] FETCH DAILY ATTENDANCE ACTION FAILURE';
export const RESET_DAILY_ATTENDANCE_DATA = '[ACADEMICS] RESET DAILY ATTENDANCE DATA';
export const SET_ATTENDANCE = '[ACADEMICS] SET ATTENDANCE';
export const SET_ATTENDANCE_DETAILS = '[ACADEMICS] SET ATTENDANCE DETAILS';
export const SET_FILTERS = '[ACADEMICS] SET ATTENDANCE FILTERS';

export function createAttendance(data, filter_form) {
    return (dispatch) => {
        UrlService.post(`attendance/students/daily`, data)
            .then(response => {
                dispatch(fetchAttendance(filter_form));
                return dispatch(toggleSnackbar({
                    message: `Attendance created successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                return dispatch(toggleSnackbar({
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
                return dispatch(toggleSnackbar({
                    message: `Attendance updated successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                return dispatch(toggleSnackbar({
                    message: 'Unable to update attendance, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    };
}

export function setFilters(filters) {
    return dispatch => {
        return dispatch({
            type: SET_FILTERS,
            payload: filters,
        });
    }
}

export function fetchAttendance(form) {
    return dispatch => {
        dispatch(setFilters(form));
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`academics/sections/${form.section_id}/attendance`, form)
            .then(response => {
                dispatch({
                    type: SET_ATTENDANCE,
                    payload: response.data
                });
                return dispatch({
                    type: ACTION_SUCCESS
                });
            })
            .catch(error => {
                dispatch({
                    type: ACTION_FAILURE
                });
                return dispatch(toggleSnackbar({
                    message: 'Unable to retrieve attendance, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function resetDailyAttendanceData() {
    return dispatch => {
        return dispatch({
            type: RESET_DAILY_ATTENDANCE_DATA,
        });
    };
}

/**
 * Updates daily attendance items
 */
export function updateAttendanceDetails({ attendance_id, items, section_id }) {
    return dispatch => {
        UrlService.put(`attendance/students/daily/${attendance_id}`, { items })
            .then(response => {
                dispatch(toggleSnackbar({
                    message: 'Attendance updated successfully.',
                    variant: SNACKBAR_SUCCESS
                }));
                dispatch(fetchAttendance(section_id));
            })
            .catch(error => {
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

export function updateFilters(form) {
    return dispatch => {
        return dispatch(fetchAttendance(form));
    }
}
