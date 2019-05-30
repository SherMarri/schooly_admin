import { UrlService } from "../..";
import history from "../../history";

export const LOADING = '[USER] LOADING';
export const SET_USER_DATA = '[USER] SET USER DATA';
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
            setTimeout(()=>{
                history.push('/');
            }, 100);
        }).catch(error => {
            return dispatch({
                type: SET_ERRORS,
                payload: error.response.data
            });
        });
    }
}