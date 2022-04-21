import { SET_CHATUSERS } from './chatusers.types';

const INITIAL_STATE = {

  allChatUsers: [],
  
};

const reducer = (state = INITIAL_STATE, action) => {
  
  switch (action.type) {

    case SET_CHATUSERS:

      return {

        ...state, allChatUsers: action.payload,

      };

    default: return state;

  }

};

export default reducer;