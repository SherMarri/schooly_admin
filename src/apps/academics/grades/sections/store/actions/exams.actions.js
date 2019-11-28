import {UrlService} from "../../../../../../core";
import {toggleSnackbar, SNACKBAR_FAILURE, SNACKBAR_SUCCESS} from "../../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] SECTION EXAMS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] SECTION EXAMS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] SECTION EXAMS ACTION FAILURE';


export const SET_SECTION_EXAMS = '[ACADEMICS] SET SECTION EXAMS';
export const ACTION_FETCH_EXAMS_DETAILS_INIT = '[ACADEMICS] ACTION_FETCH_EXAMS_DETAILS_INIT';
export const ACTION_FETCH_EXAMS_DETAILS_SUCCESS = '[ACADEMICS] ACTION_FETCH_EXAMS_DETAILS_SUCCESS';
export const ACTION_FETCH_EXAMS_DETAILS_FAILURE = '[ACADEMICS] ACTION_FETCH_EXAMS_DETAILS_FAILURE';
export const SET_SECTION_EXAM_DETAILS = '[ACADEMICS] SET_SECTION_EXAM_DETAILS';

export const FETCHING_SECTION_EXAMS_DOWNLOAD_LINK = '[ACADEMICS] SECTION EXAMS DOWNLOAD LINK';
export const SET_SECTION_EXAMS_DOWNLOAD_LINK = '[ACADEMICS] SET SECTION EXAMS DOWNLOAD LINK';
export const CLEAR_SECTION_EXAMS_DOWNLOAD_LINK = '[ACADEMICS] SECTION EXAMS CLEAR DOWNLOAD LINK';

export const RESET_EXAM_DETAILS = '[ACADEMICS] RESET EXAMS DETAILS';
export const CLEAR_TABLE_DATA = '[ACADEMICS] EXAMS CLEAR TABLE DATA';

export const SET_FILTERS = '[ACADEMICS] SET SECTION EXAMS FILTERS';


export function createExam(data) {
    return (dispatch) => {
        UrlService.post(`academics/exams`, data)
            .then(response => {
                dispatch(fetchSectionExams());
                return dispatch(toggleSnackbar({
                    message: `Exam created successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                return dispatch(toggleSnackbar({
                    message: 'Unable to create exam, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    };
}


export function fetchSectionExams(page=1) {
    return (dispatch, getState) => {
        const form = getState().academics.grades.section.exams.filter_form;
        form.page = page;
        dispatch({
            type: ACTION_INIT
        });
        dispatch(resetExamsData());
        UrlService.get(`academics/exams/`, form)
            .then(response => {
                dispatch({
                    type: SET_SECTION_EXAMS,
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
                    message: 'Unable to retrieve exams, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function fetchExamsList() {
    return (dispatch, getState) => {
        const exams = getState().academics.grades.section.exams.items;
        return exams;
    }
}

/*
export function resetExamsDetails() {
    return dispatch => {
        return dispatch({
            type: RESET_EXAMS_DETAILS,
        });
    };
}
*/

export function resetExamsData() {
    return dispatch => {
        return dispatch({
            type: CLEAR_TABLE_DATA,
        });
    };
}

export function updateExamName(form) {
    return dispatch => {
        UrlService.put(`academics/exams/${form.exam_id}`, { name: form.name })
            .then(response => {
                dispatch(toggleSnackbar({
                    message: 'Exam name updated successfully.',
                    variant: SNACKBAR_SUCCESS
                }));
                dispatch(fetchSectionExams());
            })
            .catch(error => {
                dispatch(toggleSnackbar({
                    message: 'Unable to update exam name, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}


export function fetchDownloadLink(exam_id) {
    return dispatch => {
        dispatch({
            type: FETCHING_SECTION_EXAMS_DOWNLOAD_LINK,
            payload: true,
        });
        UrlService.get(`academics/exam-details/${exam_id}`)
            .then(response => {
                const download_url = `${UrlService.getUrl('download_csv')}?file_name=${response.data}`;
                dispatch({
                    type: SET_SECTION_EXAMS_DOWNLOAD_LINK,
                    payload: download_url
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCHING_SECTION_EXAMS_DOWNLOAD_LINK,
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
            type: CLEAR_SECTION_EXAMS_DOWNLOAD_LINK,
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
        return dispatch(fetchSectionExams());
    }
}



