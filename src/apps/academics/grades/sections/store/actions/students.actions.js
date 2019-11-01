import {UrlService, Utils} from "../../../../../../core";
import { toggleSnackbar, SNACKBAR_FAILURE } from "../../../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] SECTION STUDENTS ACTION INIT';
export const ACTION_SUCCESS = '[ACADEMICS] SECTION STUDENTS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] SECTION STUDENTS ACTION FAILURE';


export const SET_SECTION_STUDENTS = '[ACADEMICS] SET SECTION STUDENTS';

export const FETCHING_SECTION_STUDENTS_DOWNLOAD_LINK = '[STAFF] SECTION STUDENTS DOWNLOAD LINK';
export const SET_SECTION_STUDENTS_DOWNLOAD_LINK = '[STAFF] STAFF SET SECTION STUDENTS DOWNLOAD LINK';
export const CLEAR_SECTION_STUDENTS_DOWNLOAD_LINK = '[STAFF] SECTION STUDENTS CLEAR DOWNLOAD LINK';


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

export function fetchDownloadLink(section_id) {
    return dispatch => {
        dispatch({
            type: FETCHING_SECTION_STUDENTS_DOWNLOAD_LINK,
            payload: true,
        });
        UrlService.get(`academics/sections/${section_id}/students`, {download:true})
            .then(response => {
                const download_url = `${UrlService.getUrl('download_csv')}?file_name=${response.data}`;
                dispatch({
                    type: SET_SECTION_STUDENTS_DOWNLOAD_LINK,
                    payload: download_url
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCHING_SECTION_STUDENTS_DOWNLOAD_LINK,
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
            type: CLEAR_SECTION_STUDENTS_DOWNLOAD_LINK,
        });
    }
}


