import React from 'react';
import SignUp from './components/sign-up/sign-up.component';
import SignIn from './components/sign-in/sign-in.component';
import SignInLinkEmail from './components/sign-in-link-email/sign-in-link-email.component';
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
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signin-link-email" component={SignInLinkEmail} />
        </Switch>
      </UserProvider>
    </div>
  );
};

export default App;
