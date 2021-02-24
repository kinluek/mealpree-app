import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { auth } from '../../firebase/auth';
import { useSelector } from 'react-redux';
import type { RootState } from '../../state/types';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  logo: {
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

const Header: React.FunctionComponent = () => {
  const classes = useStyles();
  const history = useHistory();

  const isAuthed = useSelector((state: RootState) => state.user.isAuthed);
  const isVendorAdmin = useSelector((state: RootState) => state.user.isVendorAdmin);

  const signOut = () => {
    return auth
      .signOut()
      .then(() => history.push('/'))
      .catch(console.log);
  };

  return (
    <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.toolbarTitle}>
          <Typography onClick={() => history.push('/')} variant="h6" color="inherit" className={classes.logo}>
            mealpree
          </Typography>
        </div>
        {isVendorAdmin ? (
          <Button
            onClick={() => history.push('/myshop')}
            color="primary"
            variant="outlined"
            className={classes.link}
            size="small"
          >
            My Shop
          </Button>
        ) : null}
        {!isAuthed ? (
          <Button
            onClick={() => history.push('/signin')}
            color="primary"
            variant="outlined"
            className={classes.link}
            size="small"
          >
            Login
          </Button>
        ) : (
          <Button onClick={signOut} color="primary" variant="outlined" className={classes.link} size="small">
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;