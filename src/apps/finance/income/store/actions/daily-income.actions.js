import UrlService from '../../../../../core/UrlService';
import {SNACKBAR_FAILURE, SNACKBAR_SUCCESS, toggleSnackbar} from "../../../../../core/store/actions/common.actions";

export const SET_DAILY_INCOME = '[DAILY INCOME] SET DAILY INCOME';
export const FETCHING_DAILY_INCOME = '[DAILY INCOME] FETCHING DAILY INCOME';
export const UPDATE_INCOME_ITEM_STATUS = '[DAILY INCOME] UPDATE EXPENSE ITEM STATUS';
export const ADD_INCOME_ITEM = '[DAILY INCOME] ADD ITEM';

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
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}

export function addIncomeItem(data) {
    return (dispatch) => {
        UrlService.post('finance/income/items', data)
        .then(response => {
            dispatch(fetchDailyIncome());
            dispatch(toggleSnackbar({
                message: `Item added successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
            return dispatch({
                type: ADD_INCOME_ITEM,
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
