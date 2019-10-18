import {combineReducers} from "redux";
import items from './grades.reducer';
import notifications from './notifications.reducer'
import section from '../../sections/store/reducers'

const grades = combineReducers({
    items,
    notifications,
    section,

});

export default grades;
