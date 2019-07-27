import { UrlService } from "../..";
import history from "../../history";
import { toggleSnackbar, SNACKBAR_FAILURE, SNACKBAR_INFO, SNACKBAR_SUCCESS } from "./common.actions";

export const LOADING = '[USER] LOADING';
export const SET_USER_DATA = '[USER] SET USER DATA';
export const CLEAR_USER_DATA = '[USER] CLEAR USER DATA';

export function login({username, password}) {
    return dispatch => {
        dispatch({
            type: LOADING,
            payload: true,
        });
        UrlService.post('users/login', {
            username: username,
            password: password
        }).then(response=>{
            dispatch({
                type: SET_USER_DATA,
                payload: response.data
            });
            dispatch({
                type: LOADING,
                payload: false,
            });
            dispatch(toggleSnackbar({
                message: `Welcome ${response.data.user.fullname}`,
                variant: SNACKBAR_INFO,
            }));
            setTimeout(()=>{
                history.push('/academics/students');
            }, 100);
        }).catch(error => {
            dispatch(toggleSnackbar({
                message: 'Invalid credentials. Please try again with valid username and password.',
                variant: SNACKBAR_FAILURE,
            }));
            dispatch({
                type: LOADING,
                payload: false,
            });
        });
    }
}

export function logout() {
    return dispatch => {
        UrlService.post('users/logout').then(response => {
            dispatch({
                type: CLEAR_USER_DATA,
            });
            dispatch(toggleSnackbar({
                message: 'Logged out safely.',
                variant: SNACKBAR_SUCCESS,
            }));
        }).catch(error => {
            dispatch({
                type: CLEAR_USER_DATA,
            });
        });
    }
}