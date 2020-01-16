export const assignUser = (id) => {
    return {type: "LOGIN", payload: id};
}

export const logoutUser = () => {
    return {type: "LOGOUT"}
}

export const navSubreddit = (subreddit) => {
    // console.log("nav search sub",subreddit)
    return {type: "NAV_SUBREDDIT", payload: subreddit}
}