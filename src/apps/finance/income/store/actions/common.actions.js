import { UrlService, Utils } from "../../../../../core";

export const FETCH_CATEGORIES = '[INCOME COMMON] FETCH CATEGORIES';

export const SET_SUMMARY = '[INCOME COMMON] SET SUMMARY';
export const SET_FILTERS = '[INCOME COMMON] SET FILTERS';
export const SET_DETAILS = '[INCOME COMMON] SET DETAILS';
export const CLEAR_REPORTS_DATA = '[INCOME COMMON] CLEAR REPORTS DATA';
export const SET_LOADING = '[INCOME COMMON] SET LOADING';

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

export function setLoading(value) {
    return dispatch => {
        return dispatch({
            type: SET_LOADING,
            payload: value
        });
    }
}

export function fetchSummary() {
    return dispatch => {
        dispatch(setLoading(true));
        UrlService.get('finance/income/summary')
        .then(response => {
            dispatch({
                type: SET_SUMMARY,
                payload: response.data
            });
            dispatch(setLoading(false));
        })
        .catch(error => {
            // TODO: SNACKBAR?
            dispatch(setLoading(false));
        });
    }
}

export function updateFilters(filters) {
    return dispatch => {
        dispatch({
            type: CLEAR_REPORTS_DATA,
        });
        return dispatch(fetchDetails(filters));
    }
}

export function setFilters(filters) {
    return dispatch => {
        return dispatch({
            type: SET_FILTERS,
            payload: filters,
        });
    }
}

export function fetchDetails(params) {
    return dispatch => {
        dispatch(setFilters(params));
        dispatch(setLoading(true));
        let filters = params;
        if (params.start_date) {
            filters.start_date = Utils.formatDate(params.start_date); 
        }
        if (params.end_date) {
            filters.end_date = Utils.formatDate(params.end_date); 
        }
        UrlService.get('finance/income/details', filters)
        .then(response => {
            dispatch({
                type: SET_DETAILS,
                payload: response.data
            });
            dispatch(setLoading(false));
        })
        .catch(error => {
            // TODO
            dispatch(setLoading(false));
        });
    }
}