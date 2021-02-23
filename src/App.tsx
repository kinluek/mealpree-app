import React from 'react';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import HomePage from './pages/Home';
import MyShopPage from './pages/MyShop';
import Header from './components/Header';
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
            <Route path="/myshop" component={MyShopPage} />
            <Route exact path="/signup" component={SignUpPage} />
            <Route exact path="/signin" component={SignInPage} />
          </Switch>
        </UserProvider>
      </div>
    </React.Fragment>
  );
};

export default App;
