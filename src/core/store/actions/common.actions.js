export const TOGGLE_SNACKBAR = '[COMMON] TOGGLE SNACKBAR';

export function toggleSnackbar(message) {
    return dispatch => {
        dispatch({
            type: TOGGLE_SNACKBAR,
            payload: message
        });

        setTimeout(()=>{
            return dispatch({
                type: TOGGLE_SNACKBAR,
            });
        }, 3000);
    }
}