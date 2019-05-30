import { UrlService } from "../../../../../core";

export const FETCH_CATEGORIES = '[INCOME COMMON] FETCH CATEGORIES';


export function fetchCategories() {
    return (dispatch) => {
        UrlService.get('finance/income/categories')
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