import cookie from "cookie_js";

const adminToKen = "admin_toKen";
const usernameKey = "username";
const userIdKey = "id";
const communityKey = "community";

export function getToKen(){
    return cookie.get(adminToKen);
}

export function setToKen(toKen){
    return cookie.set(adminToKen,toKen);
}

export function removeToKen(){
    return cookie.remove(adminToKen);
}

export function setUserName(value){
    return cookie.set(usernameKey, value)
}

export function getUsername(){
    return cookie.get(usernameKey);
}

export function removeUsername(){
    return cookie.remove(usernameKey);
}

export function setUserId(value){
    return cookie.set(userIdKey, value)
}
export function getUserId(){
    return cookie.get(userIdKey);
}

export function removeUserId(){
    return cookie.remove(userIdKey);
}

export function setCommunity(value){
    return cookie.set(communityKey, value)
}
export function getCommunity(){
    return cookie.get(communityKey);
}

export function removeCommunity(){
    return cookie.remove(communityKey);
}



