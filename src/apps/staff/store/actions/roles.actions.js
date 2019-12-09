import { UrlService } from "../../../../core";
import {toggleSnackbar, SNACKBAR_FAILURE, SNACKBAR_SUCCESS} from "../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[STAFF] ROLES ACTION INIT';
export const ACTION_SUCCESS = '[STAFF] ROLES ACTION SUCCESS';
export const ACTION_FAILURE = '[STAFF] ROLES ACTION FAILURE';

export const ROLE_DIALOG_ACTION_INIT = '[STAFF] ROLE DIALOG ACTION INIT';
export const ROLE_DIALOG_ACTION_SUCCESS = '[STAFF] ROLE DIALOG ACTION SUCCESS';
export const ROLE_DIALOG_ACTION_FAILURE = '[STAFF] ROLE DIALOG ACTION FAILURE';

export const SET_ROLES = '[STAFF] SET ROLES';
export const SET_USERS_BY_ROLE = '[STAFF] SET USERS BY ROLE';

export function fetchDetails() {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get('users/groups')
        .then(response => {
            dispatch({
                type: SET_ROLES,
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

export function fetchUsersByRole(group_name) {
    return dispatch => {
        dispatch({
            type: ROLE_DIALOG_ACTION_INIT
        });
        UrlService.get(`users/staff`, {group: group_name})
            .then(response => {
                dispatch({
                    type: SET_USERS_BY_ROLE,
                    payload: response.data
                });
                dispatch({
                    type: ROLE_DIALOG_ACTION_SUCCESS
                });
            })
            .catch(error => {
                dispatch({
                    type: ROLE_DIALOG_ACTION_FAILURE
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to process your request, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function unassignRole(data) {
    return dispatch => {
        dispatch({
            type: ROLE_DIALOG_ACTION_INIT
        });
        data.action = 'unassign';
        UrlService.post(`users/groups`, data)
            .then(response => {
                dispatch({
                    type: ROLE_DIALOG_ACTION_SUCCESS
                });
                dispatch(fetchUsersByRole(data.group_name));
                dispatch(toggleSnackbar({
                    message: `User removed from role successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                dispatch({
                    type: ROLE_DIALOG_ACTION_FAILURE
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to process your request, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function assignRole(data) {
    return dispatch => {
        dispatch({
            type: ROLE_DIALOG_ACTION_INIT
        });
        data.action = 'assign';
        UrlService.post(`users/groups`, data)
            .then(response => {
                dispatch({
                    type: ROLE_DIALOG_ACTION_SUCCESS
                });
                dispatch(fetchUsersByRole(data.group_name));
                dispatch(toggleSnackbar({
                    message: `Assigned roles successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                dispatch({
                    type: ROLE_DIALOG_ACTION_FAILURE
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to process your request, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}