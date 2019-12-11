import {combineReducers} from 'redux';
import staff from './staff.reducer';
import attendance from './attendance.reducer';
import roles from './roles.reducer';


const hr = combineReducers({
    staff,
    attendance,
    roles,
});

export default hr;