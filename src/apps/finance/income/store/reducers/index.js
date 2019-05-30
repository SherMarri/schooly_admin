import {combineReducers} from 'redux';
import daily from './daily-income.reducer';
import common from './common.reducer';

const income = combineReducers({
    daily,
    common,
});

export default income;
