import React from 'react';
import AppContext from './AppContext';
import { routes } from './core';
import Provider from 'react-redux/es/components/Provider';
import store from './core/store';
import { Router } from 'react-router-dom'
import history from './core/history';

import { ScrollToTop, Authorization, Layout } from './core/components';


class App extends React.Component {

  render() {
    return (
      <AppContext.Provider
        value={{
          routes
        }}
      >
        <Provider store={store}>
          <Router history={history}>
            <ScrollToTop>
              <Authorization>
                <Layout />
              </Authorization>
            </ScrollToTop>
          </Router>
        </Provider>
      </AppContext.Provider>
    );
  }

}

export default App;
