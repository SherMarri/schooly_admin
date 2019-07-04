import {combineReducers} from 'redux';
import finance from '../../../apps/finance/store/reducers';
import auth from './auth.reducer';
import common from './common.reducer';


const createReducer = (asyncReducers) =>
    combineReducers({
        auth,
        common,
        finance,
        ...asyncReducers
    });

export default createReducer;
