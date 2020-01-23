const defaultState = {
    id: -1,
    subreddit: 'all',
    nsfw: false
}

let userReducer = (prevState = defaultState, action) => {
    // console.log("inside reducer");
    switch(action.type){
        case "LOGIN":
            return {...prevState, id: action.payload};
        case "LOGOUT":
            return {...prevState, id: -1};
        case "NAV_SUBREDDIT":
            return {...prevState, subreddit: action.payload};
        case "NSFW":
            return {...prevState, nsfw: !prevState.nsfw};
        default:
            return prevState;
    }
}

export default userReducer;