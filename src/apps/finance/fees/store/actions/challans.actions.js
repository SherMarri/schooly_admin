import { UrlService } from "../../../../../core";

export const SET_GRADES = '[FEES CHALLANS] SET GRADES';
export const UPDATE_ITEM = '[FEES CHALLANS] UPDATE ITEM';
export const UPDATE_ITEM_STATUS = '[FEES CHALLANS] UPDATE ITEM STATUS';
export const FETCHING_CHALLANS = '[FEE CHALLANS] FETCHING CHALLANS';
export const SET_CHALLANS = '[FEE CHALLANS] SET CHALLANS';
export const IDLE = 0;
export const PROCESSING = 1;
export const SUCCESSFUL = 2;
export const UNSUCCESSFUL = 3;

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


export function generateChallans(data) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_ITEM_STATUS,
            payload: PROCESSING
        });

        UrlService.post('finance/fees/challans', data)
        .then(response => {
            dispatch({
                type: UPDATE_ITEM_STATUS,
                payload: SUCCESSFUL
            });
        })
        .catch(error => {
            dispatch({
                type: UPDATE_ITEM_STATUS,
                payload: UNSUCCESSFUL
            });
        });

    };
}

export function fetchChallans(params) {
    return dispatch => {
        dispatch({
            type: FETCHING_CHALLANS,
        });
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

export function fetchGrades() {
    return dispatch => {
      UrlService.get('structure/grades')
      .then(response=>{
          return dispatch({
              type: SET_GRADES,
              payload: response.data
          });
      }).catch(response=>{
        // TODO: HANDLE THIS EXCEPTION    
        return dispatch({
            type: SET_GRADES,
            payload: []
        });
      });
    };
}