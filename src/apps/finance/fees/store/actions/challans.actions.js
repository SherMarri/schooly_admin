import { UrlService, Utils } from "../../../../../core";
import {SNACKBAR_FAILURE, SNACKBAR_SUCCESS, toggleSnackbar} from "../../../../../core/store/actions/common.actions";

export const UPDATE_ITEM = '[FEES CHALLANS] UPDATE ITEM';
export const UPDATE_ITEM_STATUS = '[FEES CHALLANS] UPDATE ITEM STATUS';
export const FETCHING_CHALLANS = '[FEE CHALLANS] FETCHING CHALLANS';
export const SET_CHALLANS = '[FEE CHALLANS] SET CHALLANS';
export const SET_FILTERS = '[FEE CHALLANS] SET FILTERS';

export const IDLE = 0;
export const PROCESSING = 1;
export const SUCCESSFUL = 2;
export const UNSUCCESSFUL = 3;

export const FETCHING_DOWNLOAD_LINK = '[FEE CHALLANS] FETCHING DOWNLOAD LINK';
export const SET_DOWNLOAD_LINK = '[FEE CHALLANS] SET DOWNLOAD LINK';
export const CLEAR_DOWNLOAD_LINK = '[FEE CHALLANS] CLEAR DOWNLOAD LINK';

export function applyFilters(filters) {
    return dispatch => {
        dispatch({
            type: SET_FILTERS,
            payload: filters,
        });
        return dispatch(fetchChallans(filters));
    }
}

export function setItemStatus(status) {
    return dispatch => {
        return dispatch({
            type: UPDATE_ITEM_STATUS,
            payload: status,
        })
    }
}

export function payFeeChallan(challan_id, data) {
    return dispatch => {
        dispatch({
            type: UPDATE_ITEM_STATUS,
            payload: PROCESSING
        });
        UrlService.post(`finance/fees/challans/${challan_id}/pay`, data)
        .then(response => {
            dispatch({
                type: UPDATE_ITEM_STATUS,
                payload: SUCCESSFUL
            });
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


export function generateChallans(data, filter_form) {
    return (dispatch) => {
        UrlService.post('finance/fees/challans', data)
        .then(response => {
            dispatch(toggleSnackbar({
                message: `Challans generated successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
            dispatch(fetchChallans(filter_form));
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });

    };
}

export function fetchChallans(params) {
    return dispatch => {
        dispatch({
            type: FETCHING_CHALLANS,
        });
        let filters = params;
        if (params.from) {
            filters.from = Utils.formatDate(params.from); 
        }
        if (params.to) {
            filters.to = Utils.formatDate(params.to); 
        }
        UrlService.get('finance/fees/challans', params)
        .then(response=>{
            return dispatch({
                type: SET_CHALLANS,
                payload: response.data
            });
        }).catch(response=>{
          // TODO: HANDLE THIS EXCEPTION    
          return dispatch({
              type: SET_CHALLANS,
              payload: []
          });
        });
      };
}

export function deleteChallan(id, filter_form) {
    return dispatch => {
        UrlService.delete(`finance/fees/challans/${id}`) 
        .then(response => {
            dispatch(toggleSnackbar({
                message: 'Challan deleted successfully.',
                variant: SNACKBAR_SUCCESS
            }));
            dispatch(fetchChallans(filter_form));
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}

export function clearDownloadLink() {
    return dispatch => {
        return dispatch({
            type: CLEAR_DOWNLOAD_LINK,
        });
    }
}

export function fetchDownloadLink(params) {
    return dispatch => {
        let filters = params;
        dispatch({
            type: FETCHING_DOWNLOAD_LINK,
            payload: true,
        });
        UrlService.get('finance/fees/challans', filters)
        .then(response => {
            const download_url = `${UrlService.getUrl('downloadcsv')}?file_name=${response.data}`;
            dispatch({
                type: SET_DOWNLOAD_LINK,
                payload: download_url
            });
        })
        .catch(error => {
            dispatch({
                type: FETCHING_DOWNLOAD_LINK,
                payload: false,
            });
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}