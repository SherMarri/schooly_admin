import { UrlService } from "../../../../../../core";
import { toggleSnackbar, SNACKBAR_FAILURE } from "../../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] SECTION STUDENTS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] SECTION STUDENTS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] SECTION STUDENTS ACTION FAILURE';


export const SET_SECTION_STUDENTS = '[ACADEMICS] SET SECTION STUDENTS';

export function fetchSectionStudents(section_id) {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`academics/sections/${section_id}/students`)
            .then(response => {
                dispatch({
                    type: SET_SECTION_STUDENTS,
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
                    message: 'Unable to retrieve students, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

