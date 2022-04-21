import { SET_CURRENT_CHAT_USER } from './current-chat-user.types';

const INITIAL_STATE = {

  currentChatUser: [],
  
};

const reducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SET_CURRENT_CHAT_USER:

      return {

        ...state, currentChatUser: action.payload,

      };

    default: return state;

  }

};

export default reducer;