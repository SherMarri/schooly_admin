import {combineReducers} from 'redux';
import items from './section-details.reducer';
import attendance from './attendance.reducer';
import notifications from './notifications.reducer';
import subjects from './subjects.reducer';
import students from './students.reducer';
import assessments from './assessments.reducer';

const section = combineReducers({
    items,
    attendance,
    subjects,
    notifications,
    students,
    assessments,
});

export default section;