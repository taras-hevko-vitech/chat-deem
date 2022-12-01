import {atom} from "recoil";


export const authState = atom({
    key: "authState",
    default: null
})

export const selectedChat = atom({
    key: "selectedChat",
    default: null
})