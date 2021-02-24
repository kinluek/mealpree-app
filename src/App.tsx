import React, { useEffect } from 'react';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import HomePage from './pages/Home';
import MyShopPage from './pages/MyShop';
import Header from './components/Header';
import { Route, Switch } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { auth } from './firebase/auth';
import { fetchUserOnAuthChangeThunk, logOutUserAction } from './state/user';
import { useDispatch } from 'react-redux';

const App: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(fetchUserOnAuthChangeThunk(user.uid));
      } else {
        dispatch(logOutUserAction());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <React.Fragment>
      <CssBaseline />
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/myshop" component={MyShopPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/signin" component={SignInPage} />
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default App;
