import { atom } from "recoil";


export const authState = atom({
    key: "authState",
    default: null
});

export const selectedChatId = atom({
    key: "selectedChat",
    default: null
});
export const selectedUserId = atom({
    key: "selectedUserId",
    default: null
});

