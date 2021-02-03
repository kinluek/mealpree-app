import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router';
import { auth, createUserWithEmailAndPassword } from '../../firebase';

const SignUp: React.FunctionComponent = () => {
  const [signUpDetails, setSignUpDetails] = useState({
    email: '',
    password: '',
  });

  // const { setCredential } = useUserContext();
  const history = useHistory();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { email, password } = signUpDetails;
    try {
      const { userCredential } = await createUserWithEmailAndPassword(email, password);
      if (!userCredential) {
        throw new Error('no user returned from firebase createUserWithEmailAndPassword');
      }
      console.log(userCredential);
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setSignUpDetails({ ...signUpDetails, [name]: value });
  };

  const { email, password } = signUpDetails;
  return (
    <div className="sign-up">
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="email" value={email} onChange={onChange} />
        <input type="password" name="password" placeholder="password" value={password} onChange={onChange} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
