import { UrlService } from "../..";
import history from "../../history";
import { toggleSnackbar, SNACKBAR_FAILURE, SNACKBAR_INFO } from "./common.actions";

export const LOADING = '[USER] LOADING';
export const SET_USER_DATA = '[USER] SET USER DATA';
export const CLEAR_USER_DATA = '[USER] CLEAR USER DATA';
export const SET_ERRORS = '[USER] SET ERRORS';

export function login({username, password}) {
    return dispatch => {
        dispatch({
            type: LOADING
        });
        UrlService.post('users/login', {
            username: username,
            password: password
        }).then(response=>{
            dispatch({
                type: SET_USER_DATA,
                payload: response.data
            });
            try {
                dispatch(toggleSnackbar({
                    message: `Welcome ${response.data.user.fullname}`,
                    variant: SNACKBAR_INFO,
                }));
            }
            catch(err) {
                
            }
            
            setTimeout(()=>{
                history.push('/academics/students');
            }, 100);
        }).catch(error => {
            dispatch(toggleSnackbar({
                message: 'Invalid credentials. Please try again with valid username and password.',
                variant: SNACKBAR_FAILURE,
            }));
            return dispatch({
                type: SET_ERRORS,
                payload: error.response.data
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
            setTimeout(()=>{
                history.push('/login');
            }, 500);
        }).catch(error => {
            dispatch({
                type: CLEAR_USER_DATA,
            });
            setTimeout(()=>{
                history.push('/login');
            }, 500);
        });
    }
}