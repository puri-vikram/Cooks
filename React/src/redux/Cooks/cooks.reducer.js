import { SAVE_COOKS } from './cooks.types';

const INITIAL_STATE = {

  cooks: [],
  
};

const reducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SAVE_COOKS:

      return {

        ...state, cooks: action.payload,

      };

    default: return state;

  }

};

export default reducer;