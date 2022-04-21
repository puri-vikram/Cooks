import { SET_CHATUSERS } from './chatusers.types';

export const setChatUsers = (payload) => {
    return {

        type: SET_CHATUSERS,
        payload: payload

    };

};