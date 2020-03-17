const defaultState = {
    id: -1,
    subreddit: 'all',
    nsfw: false,
    page: 0,
    fiftiethPage: "",
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
        case "NEXT_PAGE":
            return {...prevState, page: prevState.page+1};
        case "PREV_PAGE":
            if (prevState.page === 0) {return { ...prevState}; }
            else {return { ...prevState, page: prevState.page-1}; }
        case "SAVE_LAST_PAGE":
            return {...prevState, fiftiethPage: action.payload};
        default:
            return prevState;
    }
}

export default userReducer;