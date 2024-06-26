import { Loading } from './loader.types';

const INITIAL_STATE = {
    status: false,
};

const reducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case Loading:

           return {
             status: action.payload,
           };

         default: return state;

    }

};

export default reducer;