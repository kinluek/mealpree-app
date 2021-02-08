import React from 'react';
import SignInPage from './pages/sign-in/sign-in.page';
import SignUpPage from './pages/sign-up/sign-up.page';
import HomePage from './pages/home-page/homepage.page';
import Header from './components/header';
import UserProvider from './context/user.context';
import { Route, Switch } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';

const App: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <div className="App">
        <UserProvider>
          <Header />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/signup" component={SignUpPage} />
            <Route exact path="/signin" component={SignInPage} />
          </Switch>
        </UserProvider>
      </div>
    </React.Fragment>
  );
};

export default App;
