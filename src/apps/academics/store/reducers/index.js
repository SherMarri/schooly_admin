import {combineReducers} from 'redux';
import students from '../../students/store/students.reducer';


const academics = combineReducers({
    students,
});

export default academics;