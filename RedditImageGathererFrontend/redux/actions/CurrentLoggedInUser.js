export const assignUser = (id) => {
    return {type: "LOGIN", payload: id};
}

export const logoutUser = () => {
    return {type: "LOGOUT"}
}