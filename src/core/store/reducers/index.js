import {combineReducers} from 'redux';
import finance from '../../../apps/finance/store/reducers';
import auth from './auth.reducer';
import common from './common.reducer';
import academics from '../../../apps/academics/store/reducers';

const createReducer = (asyncReducers) =>
    combineReducers({
        auth,
        common,
        finance,
        academics,
        ...asyncReducers
    });

export default createReducer;
