import { useState } from 'react';
import { Box, Flex, Button } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { signInWithEmailAndPassword, signInWithGoogle } from '../../firebase/auth';
import { useHistory } from 'react-router';

const SignInPage: React.FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    try {
      const { userCredential } = await signInWithEmailAndPassword(email, password);
      if (!userCredential) {
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
      if (!userCredential) {
        throw new Error('no credential returned from signInWithGoogle');
      }
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex justifyContent="center">
      <Flex flexDirection="column">
        <Box as="form" onSubmit={handleSubmit} py={3} sx={{ justifyContent: 'center' }}>
          <Flex mx={-2} mb={3} flexDirection="column">
            <Box px={2} my={1}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box px={2} my={1}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
          </Flex>
          <Button bg="#66CDAA" width="100%">
            Sign in
          </Button>
        </Box>
        <Button color="white" bg="blue" width="100%" onClick={handleGoogleSignIn}>
          Sign in with Google
        </Button>
      </Flex>
    </Flex>
  );
};

export default SignInPage;
