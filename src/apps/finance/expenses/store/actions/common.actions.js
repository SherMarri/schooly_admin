import { UrlService } from "../../../../../core";

export const FETCH_CATEGORIES = '[EXPENSES COMMON] FETCH CATEGORIES';


export function fetchCategories() {
    return (dispatch) => {
        UrlService.get('finance/expenses/categories')
        .then(response => {
            dispatch({
                type: FETCH_CATEGORIES,
                payload: response.data
            });
        })
        .catch(error => {
            // TODO
        });

    }
}