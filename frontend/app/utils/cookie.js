import Cookies from "js-cookie"


export function setCookieWithKey(userData, key) {
    Cookies.set(key, userData);
}

export function getCookieWithKey(key) {
    return Cookies.get(key);
}

export function removeCookieWithKey(key){
    return Cookies.remove(key)
}