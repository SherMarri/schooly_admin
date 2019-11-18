import {combineReducers} from 'redux';
import details from './notifications.reducer';

const notifications = combineReducers({
    details,
});

export default notifications;