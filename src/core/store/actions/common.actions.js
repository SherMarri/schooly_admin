import UrlService from "../../UrlService";

export const TOGGLE_SNACKBAR = '[COMMON] TOGGLE SNACKBAR';
export const SET_GRADES = '[COMMON] SET GRADES';
export const SET_ALL_GRADES = '[COMMON] SET ALL GRADES';
export const SNACKBAR_SUCCESS = 'success';
export const SNACKBAR_FAILURE = 'error';
export const SNACKBAR_INFO = 'info';

export function toggleSnackbar({ message, variant }) {
    return dispatch => {
        dispatch({
            type: TOGGLE_SNACKBAR,
            payload: { message, variant }
        });

        setTimeout(()=>{
            return dispatch({
                type: TOGGLE_SNACKBAR,
                payload: {
                    message: null,
                    variant: null,
                }
            });
        }, 3000);
    }
}

export function fetchGrades() {
    return dispatch => {
      UrlService.get('academics/grades')
      .then(response=>{
          return dispatch({
              type: SET_GRADES,
              payload: response.data
          });
      }).catch(response=>{
        // TODO: HANDLE THIS EXCEPTION    
        return dispatch({
            type: SET_GRADES,
            payload: []
        });
      });
    };
}

export function fetchAllGrades() {
    return dispatch => {
      UrlService.get('academics/grades', {all: true,})
      .then(response=>{
          return dispatch({
              type: SET_ALL_GRADES,
              payload: response.data
          });
      }).catch(response=>{
        // TODO: HANDLE THIS EXCEPTION
        return dispatch({
            type: SET_ALL_GRADES,
            payload: []
        });
      });
    };
}