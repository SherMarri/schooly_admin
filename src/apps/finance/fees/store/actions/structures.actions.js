import { UrlService } from "../../../../../core";

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
            dispatch({
                type: DELETE_ITEM,
                payload: id
            });
        })
        .catch(error => {
            // TODO
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
            dispatch({
                type: ADD_ITEM,
                payload: response.data
            });
        })
        .catch(error => {
            dispatch({
                type: UPDATE_ITEM_STATUS,
                payload: UNSUCCESSFUL
            });
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
            dispatch({
                type: UPDATE_ITEM,
                payload: response.data
            });
        })
        .catch(error => {
            dispatch({
                type: UPDATE_ITEM_STATUS,
                payload: UNSUCCESSFUL
            });
        });

    }
}