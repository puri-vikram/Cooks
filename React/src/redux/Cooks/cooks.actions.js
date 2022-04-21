import { SAVE_COOKS } from './cooks.types';

export const saveCooks = (payload) => {

    return {

        type: SAVE_COOKS,
        payload: payload

    };

};