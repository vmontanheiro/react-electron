import { handleActions } from 'redux-actions';
import { SET_APP, RESET_STORE } from './actions';

const initialState = {
  username: ``,
};

const App = handleActions(
  {
    [RESET_STORE]: () => initialState,
    [SET_APP]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  initialState,
);

export default App;
