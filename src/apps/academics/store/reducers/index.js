import {combineReducers} from 'redux';
import students from '../../students/store/students.reducer';
import subjects from '../../subjects/store/subjects.reducer';
import grades from '../../grades/store/grades.reducer';
import gradeNotifications from '../../grades/store/gradeNotifications.reducer';
import sectionNotifications from '../../grades/store/sectionNotifications.reducer';

const academics = combineReducers({
    students,
    subjects,
    grades,
    gradeNotifications,
    sectionNotifications,
});

export default academics;