import {combineReducers} from 'redux';
import daily from './daily-income.reducer';
import common from './common.reducer';
import categories from '../../categories/store/categories.reducer';


const income = combineReducers({
    daily,
    common,
    categories
});

export default income;
