import {combineReducers} from 'redux';
import students from '../../students/store/students.reducer';
import subjects from '../../subjects/store/subjects.reducer';
import grades from '../../grades/store/grades.reducer';

const academics = combineReducers({
    students,
    subjects,
    grades,
});

export default academics;