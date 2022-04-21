import { SAVE } from './filters.types';

export const saveFilters = (payload) => {

    return {

        type: SAVE,
        payload: payload

    };

};