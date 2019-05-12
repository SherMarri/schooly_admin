import {combineReducers} from 'redux';
import finances from '../../../apps/finances/store/reducers';
import user from './user.reducer';


const createReducer = (asyncReducers) =>
    combineReducers({
        user,
        finances,
        ...asyncReducers
    });

export default createReducer;
