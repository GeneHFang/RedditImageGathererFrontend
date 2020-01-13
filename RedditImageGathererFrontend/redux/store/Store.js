import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducer from "../reducers/TestReducer";
import userReducer from "../reducers/UserReducer";


const rootReducer = combineReducers({first: reducer, second: userReducer})


const store = createStore(rootReducer, applyMiddleware(thunk));




export default store;