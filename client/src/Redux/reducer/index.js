import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loadReducer from './loaderSlice';

const rootReducer = combineReducers({
  user: userReducer,
  loader: loadReducer,
});

export default rootReducer;
