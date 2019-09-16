import * as Actions from '../actions/structures.actions';

const initialState = {
    items: [],
    loading: true
};

const structures = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SET_STRUCTURES:
        {
            const items = action.payload.map(i=>{
                return {
                    id: i.id,
                    name: i.name,
                    description: i.description,
                    total: i.total,
                    break_down: JSON.parse(i.break_down)
                };
            });
            return {
                ...state,
                loading: false,
                items: items
            }
        }
        case Actions.ADD_ITEM:
        {
            const i = action.payload;
            const items = [{
                id: i.id,
                name: i.name,
                description: i.description,
                total: i.total,
                break_down:JSON.parse(i.break_down)
            }, ...state.items];
            return {
                ...state,
                item_status: Actions.SUCCESSFUL,
                items: items
            }
        }
        case Actions.UPDATE_ITEM:
        {
            const i = action.payload;
            const items = [...state.items].map(item=>{
                if (i.id===item.id) {
                    return {
                        id: i.id,
                        name: i.name,
                        description: i.description,
                        total: i.total,
                        break_down:JSON.parse(i.break_down)
                    }
                }
                else return item;
            });
            return {
                ...state,
                item_status: Actions.SUCCESSFUL,
                items: items
            }
        }
        case Actions.DELETE_ITEM:
        {
            const id = action.payload;
            const items = [...state.items].filter(item=>id!==item.id);
            return {
                ...state,
                items: items
            }
        }
        default:
        {
            return state
        }
    }
};

export default structures;