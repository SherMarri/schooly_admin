import {combineReducers} from 'redux';
import finance from '../../../apps/finance/store/reducers';
import auth from './auth.reducer';


const createReducer = (asyncReducers) =>
    combineReducers({
        auth,
        finance,
        ...asyncReducers
    });

export default createReducer;
