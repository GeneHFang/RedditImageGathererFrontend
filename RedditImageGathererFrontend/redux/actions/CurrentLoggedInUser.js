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

export const toggleNSFW = () => {
    return {type: "NSFW"}
}

export const nextPage = () => {
    return {type: "NEXT_PAGE"};
}

export const prevPage = () => {
    return {type: "PREV_PAGE"};
}