import { SET_CURRENT_CHAT } from './current-chat.types';

export const setCurrentChat = (payload) => {

    return {

        type: SET_CURRENT_CHAT,
        payload: payload

    };

};