import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import signUpReducer from './reducers/signUpReducer';
const rootReducer = combineReducers({
  signUp: signUpReducer,
});
const store = createStore(rootReducer);
export default store;