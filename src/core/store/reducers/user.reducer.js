const initialState = getInitialState()

function getInitialState() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return user;
    }
    else return {role: 'admin'};
}

const user = function (state = initialState, action) {
    switch ( action.type )
    {
        default:
        {
            return state
        }
    }
};

export default user;
