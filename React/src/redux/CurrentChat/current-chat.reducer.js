import { SET_CURRENT_CHAT } from './current-chat.types';

const INITIAL_STATE = {

  currentChat: [],
  
};

const reducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SET_CURRENT_CHAT:

      return {

        ...state, currentChat: action.payload,

      };

    default: return state;

  }

};

export default reducer;