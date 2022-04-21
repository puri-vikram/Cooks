import { findAllInRenderedTree } from 'react-dom/cjs/react-dom-test-utils.production.min';
import { SAVE, DESTROY } from './user.types';


const INITIAL_STATE = {

  user: JSON.parse(localStorage.getItem('cuser')),
  
};

const reducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SAVE:

      return {

        ...state, user: action.payload,

      };

    case DESTROY:

      return {
        ...state, user: null,

      };

    default: return state;

  }

};

export default reducer;