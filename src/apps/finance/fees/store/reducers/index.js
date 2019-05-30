import {combineReducers} from 'redux';
import structures from './structures.reducer';
import challans from './challans.reducer';


const fees = combineReducers({
    structures,
    challans,
});

export default fees;
