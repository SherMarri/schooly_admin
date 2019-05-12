import {combineReducers} from 'redux';
import expenses from '../../expenses/store/reducers'

const finances = combineReducers({
    expenses,
});

export default finances;