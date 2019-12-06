import {combineReducers} from 'redux';
import staff from './staff.reducer';
import attendance from './attendance.reducer';


const hr = combineReducers({
    staff,
    attendance,
});

export default hr;