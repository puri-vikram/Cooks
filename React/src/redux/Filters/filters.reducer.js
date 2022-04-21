import { SAVE } from './filters.types';


const INITIAL_STATE = {

  filters: [],
  
};

const reducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SAVE:

      return {

        ...state, filters: action.payload,

      };

    default: return state;

  }

};

export default reducer;