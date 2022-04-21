import { SAVE, DESTROY } from './user.types';

export const saveUser = (payload) => {

    return {

        type: SAVE,
        payload: payload

    };

};

export const destroyUser = () => {

    return {

        type: DESTROY,

    };

};