import {UrlService} from "../../../../../../core";
import {toggleSnackbar, SNACKBAR_FAILURE, SNACKBAR_SUCCESS} from "../../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] SECTION ASSESSMENTS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] SECTION ASSESSMENTS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] SECTION ASSESSMENTS ACTION FAILURE';


export const SET_SECTION_ASSESSMENTS = '[ACADEMICS] SET SECTION ASSESSMENTS';

export const FETCHING_SECTION_ASSESSMENTS_DOWNLOAD_LINK = '[STAFF] SECTION ASSESSMENTS DOWNLOAD LINK';
export const SET_SECTION_ASSESSMENTS_DOWNLOAD_LINK = '[STAFF] STAFF SET SECTION ASSESSMENTS DOWNLOAD LINK';
export const CLEAR_SECTION_ASSESSMENTS_DOWNLOAD_LINK = '[STAFF] SECTION ASSESSMENTS CLEAR DOWNLOAD LINK';

export const SET_FILTERS = '[ACADEMICS] SET SECTION ASSESSMENTS FILTERS';


export function createAssessment(data) {
    return (dispatch) => {
        UrlService.post(`academics/sections/${data.section_id}/assessments`, data)
            .then(response => {
                dispatch(fetchSectionAssessments());
                return dispatch(toggleSnackbar({
                    message: `Assessment created successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                return dispatch(toggleSnackbar({
                    message: 'Unable to create assessment, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    };
}


export function fetchSectionAssessments() {
    return (dispatch, getState) => {
        const form = getState().academics.grades.section.assessments.filter_form;
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`academics/sections/${form.section_id}/assessments`, form)
            .then(response => {
                dispatch({
                    type: SET_SECTION_ASSESSMENTS,
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
                    message: 'Unable to retrieve assessments, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function fetchDownloadLink(section_id) {
    return dispatch => {
        dispatch({
            type: FETCHING_SECTION_ASSESSMENTS_DOWNLOAD_LINK,
            payload: true,
        });
        UrlService.get(`academics/sections/${section_id}/assessments`, {download:true})
            .then(response => {
                const download_url = `${UrlService.getUrl('users/staff/downloadcsv')}?file_name=${response.data}`;
                dispatch({
                    type: SET_SECTION_ASSESSMENTS_DOWNLOAD_LINK,
                    payload: download_url
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCHING_SECTION_ASSESSMENTS_DOWNLOAD_LINK,
                    payload: false,
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to process your request, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function clearDownloadLink() {
    return dispatch => {
        return dispatch({
            type: CLEAR_SECTION_ASSESSMENTS_DOWNLOAD_LINK,
        });
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

export function updateFilters(form) {
    return dispatch => {
        dispatch(setFilters(form));
        return dispatch(fetchSectionAssessments());
    }
}



