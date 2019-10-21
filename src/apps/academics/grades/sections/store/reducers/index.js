import {combineReducers} from 'redux';
import attendance from './attendance.reducer';
import notifications from './notifications.reducer';
import subjects from './subjects.reducer';
import students from './students.reducer';

const section = combineReducers({
    // items, TODO: for section details reducer
    attendance,
    subjects,
    notifications,
    students,
});

export default section;