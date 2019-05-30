import {combineReducers} from 'redux';
import expenses from '../../expenses/store/reducers';
import income from '../../income/store/reducers';
import fees from '../../fees/store/reducers';


const finance = combineReducers({
    expenses,
    income,
    fees
});

export default finance;