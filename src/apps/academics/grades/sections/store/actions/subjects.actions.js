import { UrlService } from "../../../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] SECTION SUBJECTS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] SECTION SUBJECTS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] SECTION SUBJECTS ACTION FAILURE';

export const SET_SECTION_SUBJECTS = '[ACADEMICS] SET SECTION SUBJECTS';
export const SET_SECTION_SUBJECT_DETAILS = '[ACADEMICS] SET SECTION SUBJECTS DETAILS';


export function createSectionSubject(data) {
    debugger;
    return (dispatch) => {
        UrlService.post(`academics/sections/${data.section_id}/subjects`, data)
            .then(response => {
                dispatch(fetchSectionSubjects(data.section_id));
                dispatch(toggleSnackbar({
                    message: `Section subject created successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                dispatch(toggleSnackbar({
                    message: 'Unable to create section subject, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    };
}

export function updateSectionSubject(data) {
    debugger;
    return (dispatch) => {
        UrlService.put(`academics/sections/${data.section_id}/subjects`, data)
            .then(response => {
                dispatch(fetchSectionSubjects(data.section_id));
                dispatch(toggleSnackbar({
                    message: `Section subject updated successfully.`,
                    variant: SNACKBAR_SUCCESS
                }));
            })
            .catch(error => {
                dispatch(toggleSnackbar({
                    message: 'Unable to update section subject, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    };
}

export function fetchSectionSubjects(section_id) {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`academics/sections/${section_id}/subjects`)
            .then(response => {
                dispatch({
                    type: SET_SECTION_SUBJECTS,
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
                    message: 'Unable to retrieve section subjects, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

/*export function deleteSectionSubject(id) {
    return dispatch => {
        UrlService.delete(`section-subject/${id}`)
            .then(response => {
                dispatch(fetchSectionSubjects());
                dispatch(toggleSnackbar({
                    message: 'Section subject deleted successfully.',
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
}*/

