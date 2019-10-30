import { UrlService } from "../../../../../../core";
import { toggleSnackbar, SNACKBAR_FAILURE } from "../../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] SECTION DETAILS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] SECTION DETAILS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] SECTION DETAILS ACTION FAILURE';

export const SET_SECTION_DETAILS = '[ACADEMICS] SET SECTION DETAILS';

export function fetchSectionDetails(section_id) {
    return dispatch => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`academics/sections/${section_id}`, {summary: true})
            .then(response => {
                dispatch({
                    type: SET_SECTION_DETAILS,
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
                    message: 'Unable to retrieve section details, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}
