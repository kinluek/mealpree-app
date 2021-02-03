import React from 'react';
import SignInPage from './pages/sign-in/sign-in.page';
import SignUpPage from './pages/sign-up/sign-up.page';
import Header from './components/header/header.component';
import UserProvider from './context/user.context';
import { Route, Switch } from 'react-router';

import './App.css';

const App: React.FunctionComponent = () => {
  return (
    <div className="App">
      <UserProvider>
        <Header />
        <Switch>
          <Route exact path="/" render={() => <h1>Welcome to Mealpree</h1>} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/signin" component={SignInPage} />
        </Switch>
      </UserProvider>
    </div>
  );
};

export default App;
