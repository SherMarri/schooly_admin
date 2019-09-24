import {combineReducers} from 'redux';
import daily from './daily-expenses.reducer';
import categories from '../../categories/store/categories.reducer';
import common from './common.reducer';

const expenses = combineReducers({
    daily,
    common,
    categories,
});

export default expenses;
