import {combineReducers} from 'redux';
import attendance from './attendance.reducer';
import notifications from './notifications.reducer';
import subjects from './subjects.reducer';

const section = combineReducers({
    // items, TODO: for section details reducer
    attendance,
    subjects,
    notifications,
});

export default section;