import { combineReducers } from 'redux';
import counterReducer from './Counter/counter.reducer';
import userReducer from './User/user.reducer';
import cooksReducer from './Cooks/cooks.reducer';
import chatUsersReducer from './Chatusers/chatusers.reducer'
import currentChatReducer from './CurrentChat/current-chat.reducer'
import currentChatUserReducer from './CurrentChatUser/current-chat-user.reducer'
import filtersReducer from './Filters/filters.reducer'
import loaderReducer from './Loader/loader.reducer'

const rootReducer = combineReducers({
    counter: counterReducer,
    user: userReducer,
    cooks: cooksReducer,
    allchatusers: chatUsersReducer,
    currentChat: currentChatReducer,
    currentChatUser: currentChatUserReducer,
    filters: filtersReducer,
    loader: loaderReducer,
});

export default rootReducer;