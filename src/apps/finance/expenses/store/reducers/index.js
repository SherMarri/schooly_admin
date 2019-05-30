import {combineReducers} from 'redux';
import daily from './daily-expenses.reducer';
import common from './common.reducer';

const expenses = combineReducers({
    daily,
    common,
});

export default expenses;
