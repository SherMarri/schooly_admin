import UrlService from '../../../../../core/UrlService';
import { toggleSnackbar } from '../../../../../core/store/actions/common.actions';

export const SET_DAILY_INCOME = '[DAILY INCOME] SET DAILY INCOME';
export const FETCHING_DAILY_INCOME = '[DAILY INCOME] FETCHING DAILY INCOME';
export const UPDATE_INCOME_ITEM_STATUS = '[DAILY INCOME] UPDATE EXPENSE ITEM STATUS';
export const ADD_INCOME_ITEM = '[DAILY INCOME] ADD ITEM';
export const DELETE_INCOME_ITEM = '[DAILY INCOME] DELETE ITEM';

export const IDLE = 0;
export const PROCESSING = 1;
export const SUCCESSFUL = 2;
export const UNSUCCESSFUL = 3;

export function fetchDailyIncome() {
    return (dispatch) => {
        dispatch({
            type: FETCHING_DAILY_INCOME,
        });
        
        UrlService.get('finance/income/items/today')
        .then(response => {
            return dispatch({
                type: SET_DAILY_INCOME,
                payload: response.data
            });
        })
        .catch(error => {

        });

    }
}

export function addIncomeItem(data) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_INCOME_ITEM_STATUS,
            payload: PROCESSING
        });
        
        UrlService.post('finance/income/items', data)
        .then(response => {
            return dispatch({
                type: ADD_INCOME_ITEM,
                payload: response.data
            });
        })
        .catch(error => {
            return dispatch({
                type: UPDATE_INCOME_ITEM_STATUS,
                payload: UNSUCCESSFUL
            });
        });

    }
}

export function deleteItem(id) {
    return (dispatch) => {
        UrlService.delete(`finance/income/items/${id}`)
        .then( _ => {
            dispatch({
                type: DELETE_INCOME_ITEM,
                payload: id
            });
            return dispatch(toggleSnackbar(
                'Successfully deleted!'
            ));
        })
        .catch(error => {
            return dispatch(
                toggleSnackbar('Failed to delete the selected item, please contact Schooly support!')
            );
        });
    }
}

export function setIncomeItemStatus(status) {
    return dispatch => dispatch({
        type: UPDATE_INCOME_ITEM_STATUS,
        payload: status
    });
}