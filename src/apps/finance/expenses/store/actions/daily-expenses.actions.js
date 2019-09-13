import UrlService from '../../../../../core/UrlService';
import {SNACKBAR_FAILURE, SNACKBAR_SUCCESS, toggleSnackbar} from "../../../../../core/store/actions/common.actions";

export const SET_DAILY_EXPENSES = '[DAILY EXPENSES] SET DAILY EXPENSES';
export const FETCHING_DAILY_EXPENSES = '[DAILY EXPENSES] FETCHING DAILY EXPENSES';
export const UPDATE_EXPENSE_ITEM_STATUS = '[DAILY EXPENSES] UPDATE EXPENSE ITEM STATUS';
export const ADD_EXPENSE_ITEM = '[DAILY EXPENSES] ADD ITEM'
export const IDLE = 0;
export const PROCESSING = 1;
export const SUCCESSFUL = 2;
export const UNSUCCESSFUL = 3;

export function fetchDailyExpenses() {
    return (dispatch) => {
        dispatch({
            type: FETCHING_DAILY_EXPENSES,
        });
        
        UrlService.get('finance/expenses/items/today')
        .then(response => {
            return dispatch({
                type: SET_DAILY_EXPENSES,
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

export function addExpenseItem(data) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_EXPENSE_ITEM_STATUS,
            payload: PROCESSING
        });
        
        UrlService.post('finance/expenses/items', data)
        .then(response => {
            dispatch(toggleSnackbar({
                message: `Item added successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
            return dispatch({
                type: ADD_EXPENSE_ITEM,
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