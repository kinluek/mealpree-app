import React, { ChangeEvent, useState } from 'react';
import type firebase from 'firebase';
import { linkCredentialWithEmail } from '../../firebase';
import { useHistory, useLocation } from 'react-router';

type CredentialLocation = {
  credential: firebase.auth.AuthCredential | null;
};

const SignInLinkEmail: React.FunctionComponent = () => {
  const [signInDetails, setSignInDetails] = useState({
    email: '',
    password: '',
  });

  const history = useHistory();
  const { state } = useLocation<CredentialLocation>();
  const credential = state.credential;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const { email, password } = signInDetails;
      if (!credential) throw new Error('missing auth credential');
      await linkCredentialWithEmail(email, password, credential);
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setSignInDetails({ ...signInDetails, [name]: value });
  };

  const { email, password } = signInDetails;
  return (
    <div className="sign-in-link-email">
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="email" value={email} onChange={onChange} />
        <input type="password" name="password" value={password} placeholder="password" onChange={onChange} />
        <button type="submit">Link Account</button>
      </form>
    </div>
  );
};

export default SignInLinkEmail;
