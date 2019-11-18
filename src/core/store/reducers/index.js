import {combineReducers} from 'redux';
import finance from '../../../apps/finance/store/reducers';
import auth from './auth.reducer';
import common from './common.reducer';
import academics from '../../../apps/academics/store/reducers';
import hr from '../../../apps/staff/store/reducers';
import notifications from "../../../apps/notifications/store/reducers";
const createReducer = (asyncReducers) =>
    combineReducers({
        auth,
        common,
        finance,
        academics,
        hr,
        notifications,
        ...asyncReducers
    });

export default createReducer;
