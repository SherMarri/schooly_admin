import { UrlService } from "../../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] GRADE NOTIFICATIONS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] GRADES NOTIFICATIONS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] GRADES NOTIFICATIONS ACTION FAILURE';

export const SET_NOTIFICATIONS = '[ACADEMICS] SET GRADE NOTIFICATIONS';
export const SET_NOTIFICATION_DETAILS = '[ACADEMICS] SET GRADE NOTIFICATIONS DETAILS';
export const SET_FILTERS = '[ACADEMICS] SET GRADE NOTIFICATIONS FILTERS';

// export const CLEAR_TABLE_DATA = '[ACADEMICS] GRADE NOTIFICATIONS CLEAR TABLE DATA';


export function createNotification(data, filter_form) {
    return (dispatch) => {
        UrlService.post(`notifications`, data)
            .then(response => {
                dispatch(fetchNotifications(filter_form));
                dispatch(toggleSnackbar({
                    message: `Notification created successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                dispatch(toggleSnackbar({
                    message: 'Unable to create notification, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    };
}

export function updateNotification(data) {
    return (dispatch) => {
        UrlService.post(`notifications`, data)
            .then(response => {
                dispatch(fetchNotifications());
                dispatch(toggleSnackbar({
                    message: `Notification updated successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                dispatch(toggleSnackbar({
                    message: 'Unable to update notification, please contact Schooli support.',
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

export function fetchNotifications(form) {
    return dispatch => {
        dispatch(setFilters(form));
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`academics/grades/${form.target_id}/notifications`, form)
            .then(response => {
                dispatch({
                    type: SET_NOTIFICATIONS,
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
                    message: 'Unable to retrieve notifications, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function fetchNotificationDetails(notification_id) {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`notifications/${notification_id}`)
            .then(response => {
                dispatch({
                    type: SET_NOTIFICATION_DETAILS,
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
                    message: 'Unable to retrieve notification, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function deleteNotification(notification_id) {
    return dispatch => {
        UrlService.delete(`notifications/${notification_id}`)
            .then(response => {
                dispatch(fetchNotifications());
                dispatch(toggleSnackbar({
                    message: 'Notification deleted successfully.',
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
        return dispatch(fetchNotifications(form));
    }
}

