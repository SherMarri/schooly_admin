import {combineReducers} from 'redux';
import students from '../../students/store/students.reducer';
import subjects from '../../subjects/store/subjects.reducer';
import grades from '../../grades/store/reducers';

const academics = combineReducers({
    students,
    subjects,
    grades,
    // gradeNotifications,
    // sectionNotifications,
    // sectionSubjects,
    // attendance,
});

export default academics;