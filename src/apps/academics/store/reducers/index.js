import {combineReducers} from 'redux';
import students from '../../students/store/students.reducer';
import subjects from '../../subjects/store/subjects.reducer';

const academics = combineReducers({
    students,
    subjects,
});

export default academics;