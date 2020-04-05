import React from 'react';
import { HashRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider as ReduxProvider } from 'react-redux';
import RoutesProvider from './routes/RoutesProvider';
import { persistor, store } from './services/redux/store';

import SocketIOContext from './services/context';
import useSocketIO from './modules/hooks/useSocketIO';

const App = () => {
  const [socketIOContext] = useSocketIO();
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter basename="/">
          <SocketIOContext.Provider value={socketIOContext}>
            <RoutesProvider />
          </SocketIOContext.Provider>
        </HashRouter>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
