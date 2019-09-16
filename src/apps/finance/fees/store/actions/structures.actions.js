import { UrlService } from "../../../../../core";
import {SNACKBAR_FAILURE, SNACKBAR_SUCCESS, toggleSnackbar} from "../../../../../core/store/actions/common.actions";


export const SET_STRUCTURES = '[FEES STRUCTURE] FETCH STRUCTURES';
export const UPDATE_ITEM_STATUS = '[FEES STRUCTURE] UPDATE ITEM STATUS';
export const ADD_ITEM = '[FEES STRUCTURE] ADD ITEM';
export const UPDATE_ITEM = '[FEES STRUCTURE] UPDATE ITEM';
export const DELETE_ITEM = '[FEES STRUCTURE] DELETE ITEM';
export const IDLE = 0;
export const PROCESSING = 1;
export const SUCCESSFUL = 2;
export const UNSUCCESSFUL = 3;

export function fetchStructures() {
    return (dispatch) => {
        UrlService.get('finance/fees/structures')
        .then(response => {
            dispatch({
                type: SET_STRUCTURES,
                payload: response.data
            });
        })
        .catch(error => {
            // TODO
        });

    }
}

export function setItemStatus(status) {
    return dispatch => {
        return dispatch({
            type: UPDATE_ITEM_STATUS,
            payload: IDLE
        })
    }
}

export function deleteStructure(id) {
    return (dispatch) => {
        UrlService.delete(`finance/fees/structures/${id}`)
        .then(response => {
            dispatch(toggleSnackbar({
                message: `Fee structure deleted successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
            dispatch({
                type: DELETE_ITEM,
                payload: id
            });
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });

    }
}

export function addStructure(data) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_ITEM_STATUS,
            payload: PROCESSING
        });

        UrlService.post('finance/fees/structures', data)
        .then(response => {
            dispatch(toggleSnackbar({
                message: `Fee structure added successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
            dispatch({
                type: ADD_ITEM,
                payload: response.data
            });
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });

    }
}


export function updateStructure(id, data) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_ITEM_STATUS,
            payload: PROCESSING
        });

        UrlService.put(`finance/fees/structures/${id}`, data)
        .then(response => {
            dispatch(toggleSnackbar({
                message: `Fee structure updated successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
            dispatch({
                type: UPDATE_ITEM,
                payload: response.data
            });
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });

    }
}