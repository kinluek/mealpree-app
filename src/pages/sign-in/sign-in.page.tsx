import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { signInWithEmailAndPassword, signInWithGoogle } from '../../firebase/auth';
import { setAndGetUser } from '../../firebase/firestore';
import { useUserContext } from '../../context/user.context';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  alert: {
    marginBottom: theme.spacing(3),
    width: '100%',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignInPage: React.FunctionComponent = () => {
  const { userState, setUserState } = useUserContext();

  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const history = useHistory();

  if (userState) {
    history.push('/');
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(email, password);
      if (!user) throw new Error('error signing in');
      const { userDoc } = await setAndGetUser(user);
      setUserState({ user, userDoc: userDoc });
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user } = await signInWithGoogle();
      if (!user) throw new Error('error signing in');
      const { userDoc } = await setAndGetUser(user);
      setUserState({ user, userDoc: userDoc });
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        {error ? (
          <Alert className={classes.alert} severity="error" onClick={() => setError(null)}>
            {error.message}
          </Alert>
        ) : null}
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button type="submit" fullWidth variant="contained" color="default" className={classes.submit}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link onClick={() => history.push('/signup')} variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
        <Typography component="p">- OR -</Typography>
        <Button onClick={handleGoogleSignIn} fullWidth variant="contained" color="primary" className={classes.submit}>
          Sign With Google
        </Button>
      </div>
    </Container>
  );
};

export default SignInPage;
