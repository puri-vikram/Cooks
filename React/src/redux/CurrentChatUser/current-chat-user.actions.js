import { SET_CURRENT_CHAT_USER } from './current-chat-user.types';

export const setCurrentChatUser = (payload) => {

    return {

        type: SET_CURRENT_CHAT_USER,
        payload: payload

    };

};