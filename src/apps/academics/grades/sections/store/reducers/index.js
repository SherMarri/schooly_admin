import {combineReducers} from 'redux';
import items from './section-details.reducer';
import attendance from './attendance.reducer';
import notifications from './notifications.reducer';
import subjects from './subjects.reducer';
import students from './students.reducer';
import assessments from './assessments.reducer';
import exams from './exams.reducer';

const section = combineReducers({
    items,
    attendance,
    subjects,
    notifications,
    students,
    assessments,
    exams,
});

export default section;