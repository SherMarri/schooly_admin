import {UrlService} from "../../../../../../core";
import {toggleSnackbar, SNACKBAR_FAILURE, SNACKBAR_SUCCESS} from "../../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] SECTION ASSESSMENTS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] SECTION ASSESSMENTS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] SECTION ASSESSMENTS ACTION FAILURE';


export const SET_SECTION_ASSESSMENTS = '[ACADEMICS] SET SECTION ASSESSMENTS';
export const ACTION_FETCH_ASSESSMENT_DETAILS_INIT = '[ACADEMICS] ACTION_FETCH_ASSESSMENT_DETAILS_INIT';
export const ACTION_FETCH_ASSESSMENT_DETAILS_SUCCESS = '[ACADEMICS] ACTION_FETCH_ASSESSMENT_DETAILS_SUCCESS';
export const ACTION_FETCH_ASSESSMENT_DETAILS_FAILURE = '[ACADEMICS] ACTION_FETCH_ASSESSMENT_DETAILS_FAILURE';
export const SET_SECTION_ASSESSMENT_DETAILS = '[ACADEMICS] SET_SECTION_ASSESSMENT_DETAILS';

export const FETCHING_SECTION_ASSESSMENTS_DOWNLOAD_LINK = '[ACADEMICS] SECTION ASSESSMENTS DOWNLOAD LINK';
export const SET_SECTION_ASSESSMENTS_DOWNLOAD_LINK = '[ACADEMICS] SET SECTION ASSESSMENTS DOWNLOAD LINK';
export const CLEAR_SECTION_ASSESSMENTS_DOWNLOAD_LINK = '[ACADEMICS] SECTION ASSESSMENTS CLEAR DOWNLOAD LINK';

export const RESET_ASSESSMENT_DETAILS = '[ACADEMICS] RESET ASSESSMENT DETAILS';
export const CLEAR_TABLE_DATA = '[ACADEMICS] ASSESSMENT CLEAR TABLE DATA';

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


export function fetchSectionAssessments(page=1) {
    return (dispatch, getState) => {
        const form = getState().academics.grades.section.assessments.filter_form;
        form.page = page;
        dispatch({
            type: ACTION_INIT
        });
        dispatch(resetAssessmentsData());
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

export function resetAssessmentDetails() {
    return dispatch => {
        return dispatch({
            type: RESET_ASSESSMENT_DETAILS,
        });
    };
}

export function resetAssessmentsData() {
    return dispatch => {
        return dispatch({
            type: CLEAR_TABLE_DATA,
        });
    };
}

export function fetchAssessmentDetails(assessment_id) {
    return dispatch => {
        dispatch({
            type: ACTION_FETCH_ASSESSMENT_DETAILS_INIT
        });
        UrlService.get(`academics/assessments/${assessment_id}`)
            .then(response => {
                dispatch({
                    type: SET_SECTION_ASSESSMENT_DETAILS,
                    payload: response.data
                });
                dispatch({
                    type: ACTION_FETCH_ASSESSMENT_DETAILS_SUCCESS
                });
            })
            .catch(error => {
                dispatch({
                    type: ACTION_FETCH_ASSESSMENT_DETAILS_FAILURE
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to retrieve assessment, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function updateAssessmentDetails({ assessment_id, items }) {
    return dispatch => {
        UrlService.put(`academics/assessments/${assessment_id}`, { items })
            .then(response => {
                dispatch(toggleSnackbar({
                    message: 'Assessment updated successfully.',
                    variant: SNACKBAR_SUCCESS
                }));
                dispatch(fetchSectionAssessments());
            })
            .catch(error => {
                dispatch(toggleSnackbar({
                    message: 'Unable to update assessment, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}


export function fetchDownloadLink(assessment_id) {
    return dispatch => {
        dispatch({
            type: FETCHING_SECTION_ASSESSMENTS_DOWNLOAD_LINK,
            payload: true,
        });
        UrlService.get(`academics/assessments/${assessment_id}`, {download:true})
            .then(response => {
                const download_url = `${UrlService.getUrl('download_csv')}?file_name=${response.data}`;
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
        dispatch({
            type: CLEAR_TABLE_DATA,
        });
        return dispatch(fetchSectionAssessments());
    }
}



