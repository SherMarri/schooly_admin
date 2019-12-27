import { UrlService, Utils } from "../../../../core";
import { toggleSnackbar, SNACKBAR_SUCCESS, SNACKBAR_FAILURE } from "../../../../core/store/actions/common.actions";

export const ACTION_INIT = '[ACADEMICS] STUDENTS ACTION INIT';
export const EXAM_DETAILS_ACTION_INIT = '[ACADEMICS] STUDENTS EXAM DETAILS ACTION INIT';
export const STUDENT_RESULT_ACTION_INIT = '[ACADEMICS] STUDENT RESULT ACTION INIT';
export const STUDENT_DETAILS_ACTION_INIT = '[ACADEMICS] STUDENTS DETAILS ACTION INIT';
export const STUDENT_ATTENDANCE_ACTION_INIT = '[ACADEMICS] STUDENT_ATTENDANCE ACTION INIT';
export const EXAM_DETAILS_ACTION_SUCCESS = '[ACADEMICS] STUDENTS EXAM DETAILS ACTION SUCCESS';
export const STUDENT_RESULT_ACTION_SUCCESS = '[ACADEMICS] STUDENT RESULT ACTION SUCCESS';
export const STUDENT_DETAILS_ACTION_SUCCESS = '[ACADEMICS] STUDENTS DETAILS ACTION SUCCESS';
export const STUDENT_ATTENDANCE_ACTION_SUCCESS = '[ACADEMICS] STUDENT_ATTENDANCE ACTION SUCCESS';
export const ACTION_SUCCESS = '[ACADEMICS] STUDENTS ACTION SUCCESS';
export const ACTION_FAILURE = '[ACADEMICS] STUDENTS ACTION FAILURE';
export const EXAM_DETAILS_ACTION_FAILURE = '[ACADEMICS] STUDENT EXAM DETAILS ACTION FAILURE';
export const STUDENT_DETAILS_ACTION_FAILURE = '[ACADEMICS] STUDENTS DETAILS ACTION FAILURE';
export const STUDENT_RESULT_ACTION_FAILURE = '[ACADEMICS] STUDENT RESULT ACTION FAILURE';
export const STUDENT_ATTENDANCE_ACTION_FAILURE = '[ACADEMICS] STUDENT_ATTENDANCE ACTION FAILURE';
export const CLEAR_TABLE_DATA = '[ACADEMICS] STUDENTS CLEAR TABLE DATA';

export const SET_FILTERS = '[ACADEMICS] STUDENTS SET FILTERS';
export const SET_DETAILS = '[ACADEMICS] STUDENTS SET DETAILS';
export const SET_STUDENT_DETAILS = '[ACADEMICS] SET STUDENT DETAILS';
export const SET_STUDENT_EXAMS = '[ACADEMICS] SET STUDENT EXAMS';
export const SET_STUDENT_EXAM_DETAILS = '[ACADEMICS] SET STUDENT EXAM DETAILS';
export const SET_STUDENT_RESULT = '[ACADEMICS] SET STUDENT RESULT';
export const SET_STUDENT_ATTENDANCE = '[ACADEMICS] SET STUDENT ATTENDANCE';
export const FETCHING_STUDENT_RESULT_DOWNLOAD_LINK = '[ACADEMICS] STUDENTS FETCHING DOWNLOAD LINK';
export const SET_STUDENTS_DOWNLOAD_LINK = '[ACADEMICS] STUDENTS SET DOWNLOAD LINK';
export const CLEAR_STUDENTS_DOWNLOAD_LINK = '[ACADEMICS] STUDENTS CLEAR DOWNLOAD LINK';

export function addUpdateStudent(data, update=false) {
    return (dispatch, getState) => {
        const filter_form = getState().academics.students.filter_form;
        dispatch({
            type: ACTION_INIT
        });
        UrlService.post('users/students', data)
        .then(response => {
            dispatch({
                type: ACTION_SUCCESS,
            });
            dispatch(fetchDetails(filter_form));
            dispatch(toggleSnackbar({
                message: `Student ${update ? 'updated' : 'registered'} successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
        })
        .catch(error => {
            dispatch({
                type: ACTION_FAILURE,
            });
            dispatch(toggleSnackbar({
                message: 'Unable to register student, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}


export function updateStudent(data) {
    return (dispatch, ) => {
        UrlService.post('users/students', data)
        .then(response => {
            dispatch({
                type: ACTION_SUCCESS,
            });
            dispatch(toggleSnackbar({
                message: `Student updated successfully.`,
                variant: SNACKBAR_SUCCESS
            }));
            dispatch(fetchStudentDetails(data.user));
        })
        .catch(error => {
            dispatch({
                type: ACTION_FAILURE,
            });
            dispatch(toggleSnackbar({
                message: 'Unable to register student, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    };
}

export function updateFilters(filters) {
    return dispatch => {
        dispatch({
            type: CLEAR_TABLE_DATA,
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
        dispatch({
            type: ACTION_INIT
        });
        let filters = params;
        dispatch(setFilters(filters));
        if (params.start_date) {
            filters.start_date = Utils.formatDate(params.start_date);
        }
        if (params.end_date) {
            filters.end_date = Utils.formatDate(params.end_date);
        }
        UrlService.get('users/students', filters)
        .then(response => {
            dispatch({
                type: SET_DETAILS,
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
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}


export function fetchStudentDetails(student_id) {
    return dispatch => {
        dispatch({
            type: STUDENT_DETAILS_ACTION_INIT
        });
        UrlService.get(`users/students/${student_id}`)
            .then(response => {
                dispatch({
                    type: SET_STUDENT_DETAILS,
                    payload: response.data
                });
                dispatch({
                    type: STUDENT_DETAILS_ACTION_SUCCESS
                });
            })
            .catch(error => {
                dispatch({
                    type: STUDENT_DETAILS_ACTION_FAILURE
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to retrieve student details, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function clearDownloadLink() {
    return dispatch => {
        return dispatch({
            type: CLEAR_STUDENTS_DOWNLOAD_LINK,
        });
    }
}

export function deactivateStudent(params, filter_form) {
    return dispatch => {
        UrlService.delete(`users/students`, params) 
        .then(response => {
            dispatch(fetchDetails(filter_form));
            dispatch(toggleSnackbar({
                message: 'Student terminated successfully.',
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
}

export function fetchDownloadLink(params) {
    return dispatch => {
        let filters = params;
        if (params.start_date) {
            filters.start_date = Utils.formatDate(params.start_date); 
        }
        if (params.end_date) {
            filters.end_date = Utils.formatDate(params.end_date); 
        }
        dispatch({
            type: FETCHING_STUDENT_RESULT_DOWNLOAD_LINK,
            payload: true,
        });
        UrlService.get('users/students', filters)
        .then(response => {
            const download_url = `${UrlService.getUrl('download_csv')}?file_name=${response.data}`;
            dispatch({
                type: SET_STUDENTS_DOWNLOAD_LINK,
                payload: download_url
            });
        })
        .catch(error => {
            dispatch({
                type: FETCHING_STUDENT_RESULT_DOWNLOAD_LINK,
                payload: false,
            });
            dispatch(toggleSnackbar({
                message: 'Unable to process your request, please contact Schooli support.',
                variant: SNACKBAR_FAILURE
            }));
        });
    }
}

export function fetchStudentExams(form) {
    return (dispatch) => {
        dispatch({
            type: ACTION_INIT
        });
        UrlService.get(`academics/exams`, form)
            .then(response => {
                dispatch({
                    type: SET_STUDENT_EXAMS,
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

export function fetchStudentExamDetails(form) {
    return (dispatch) => {
        dispatch({
            type: EXAM_DETAILS_ACTION_INIT
        });
        UrlService.get(`academics/exam-details/${form.exam_id}`, form)
            .then(response => {
                dispatch({
                    type: SET_STUDENT_EXAM_DETAILS,
                    payload: response.data
                });
                dispatch({
                    type: EXAM_DETAILS_ACTION_SUCCESS
                });
            })
            .catch(error => {
                dispatch({
                    type: EXAM_DETAILS_ACTION_FAILURE
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to retrieve exam details, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function fetchStudentResultDownloadLink(student_id) {
    return dispatch => {
        dispatch({
            type: FETCHING_STUDENT_RESULT_DOWNLOAD_LINK,
            payload: true,
        });
        UrlService.get(`academics/student-result/${student_id}`)
            .then(response => {
                const download_url = `${UrlService.getUrl('download_csv')}?file_name=${response.data}`;
                dispatch({
                    type: SET_STUDENTS_DOWNLOAD_LINK,
                    payload: download_url
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCHING_STUDENT_RESULT_DOWNLOAD_LINK,
                    payload: false,
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to process your request, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function fetchStudentResult(student_id) {
    return (dispatch) => {
        dispatch({
            type: STUDENT_RESULT_ACTION_INIT
        });
        UrlService.get(`academics/student-result/${student_id}`, {view: true})
            .then(response => {
                dispatch({
                    type: SET_STUDENT_RESULT,
                    payload: response.data
                });
                dispatch({
                    type: STUDENT_RESULT_ACTION_SUCCESS
                });
            })
            .catch(error => {
                dispatch({
                    type: STUDENT_RESULT_ACTION_FAILURE
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to retrieve student result, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}

export function fetchStudentAttendance(student_id) {
    return (dispatch) => {
        dispatch({
            type: STUDENT_ATTENDANCE_ACTION_INIT
        });
        UrlService.get(`attendance/students/daily`, {student_id: student_id})
            .then(response => {
                dispatch({
                    type: SET_STUDENT_ATTENDANCE,
                    payload: response.data
                });
                dispatch({
                    type: STUDENT_ATTENDANCE_ACTION_SUCCESS
                });
            })
            .catch(error => {
                dispatch({
                    type: STUDENT_ATTENDANCE_ACTION_FAILURE
                });
                dispatch(toggleSnackbar({
                    message: 'Unable to retrieve student attendance, please contact Schooli support.',
                    variant: SNACKBAR_FAILURE
                }));
            });
    }
}


