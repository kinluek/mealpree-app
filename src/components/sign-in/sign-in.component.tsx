import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router';
import { auth, signInWithGoogle } from '../../firebase/auth';

const SignIn: React.FunctionComponent = () => {
  const [signInDetails, setSignInDetails] = useState({
    email: '',
    password: '',
  });

  const history = useHistory();

  const handleEmailSignIn = async (event: FormEvent) => {
    event.preventDefault();
    const { email, password } = signInDetails;
    try {
      const creds = await auth.signInWithEmailAndPassword(email, password);
      if (!creds.user) {
        throw new Error('no user returned from firebase signInWithEmailAndPassword');
      }
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { userCredential } = await signInWithGoogle();
      if (userCredential) {
        history.push('/');
        return;
      } else {
        throw new Error('no credential returned from signInWithGoogle');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSignIn = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setSignInDetails({ ...signInDetails, [name]: value });
  };

  const { email, password } = signInDetails;
  return (
    <div className="sign-in">
      <form onSubmit={handleEmailSignIn}>
        <input type="email" name="email" placeholder="email" value={email} onChange={onChangeSignIn} />
        <input type="password" name="password" placeholder="password" value={password} onChange={onChangeSignIn} />
        <button type="submit">Sign In</button>
      </form>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;
