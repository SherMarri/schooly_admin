import { UrlService, Utils } from "../../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[EXPENSES] CATEGORIES ACTION INIT';
export const ACTION_SUCCESS = '[EXPENSES] CATEGORIES ACTION SUCCESS';
export const ACTION_FAILURE = '[EXPENSES] CATEGORIES ACTION FAILURE';

export const SET_CATEGORIES = '[EXPENSES] CATEGORIES SET DETAILS';

export function createCategory(data) {
    data['category_type'] = 1;
    return (dispatch) => {
        UrlService.post('finance/income/categories', data)
        .then(response => {
            dispatch(fetchCategories());
            dispatch(toggleSnackbar({
                message: `Category created successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to create category, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}

export function updateCategory(subject_id, data) {
    data['category_type'] = 1;
    return (dispatch) => {
        UrlService.patch(`finance/income/categories/${subject_id}`, data)
        .then(response => {
            dispatch(fetchCategories());
            dispatch(toggleSnackbar({
                message: `Category updated successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch(toggleSnackbar({
                message: 'Unable to update category, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}

export function fetchCategories() {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get('finance/income/categories')
        .then(response => {
            dispatch({
                type: SET_CATEGORIES,
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
                message: 'Unable to retrieve categories, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}

export function deleteCategory(subject_id) {
    return dispatch => {
        UrlService.delete(`finance/income/categories/${subject_id}`)
        .then(response => {
            dispatch(fetchCategories());
            dispatch(toggleSnackbar({
                message: 'Category deleted successfully.',
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
