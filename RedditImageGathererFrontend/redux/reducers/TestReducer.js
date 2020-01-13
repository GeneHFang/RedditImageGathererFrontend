const defaultState = {
    increment: 0,
}

let reducer = (prevState = defaultState, action) => {
    console.log("inside reducer");
    switch(action.type){
        case "INCREMENT":
            return {...prevState, increment: prevState.increment+1};
        default:
            return prevState;
    }
}

export default reducer;