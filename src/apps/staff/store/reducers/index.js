import {combineReducers} from 'redux';
import staff from './staff.reducer';


const hr = combineReducers({
    staff,
});

export default hr;