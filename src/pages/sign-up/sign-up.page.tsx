import { useState } from 'react';
import { Box, Flex, Button } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { createUserWithEmailAndPassword } from '../../firebase/auth';
import { useHistory } from 'react-router';

const SignUpPage: React.FunctionComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    try {
      if (confirmedPassword !== password) {
        alert('passwords do not match');
        return;
      }

      const { alternative } = await createUserWithEmailAndPassword(email, password);
      if (alternative) {
        alert('email already in use');
        return;
      }

      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex justifyContent="center">
      <Box as="form" onSubmit={handleSubmit} py={3} sx={{ justifyContent: 'center' }}>
        <Flex mx={-2} mb={3} flexDirection="column">
          <Box my={1}>
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              name="first-name"
              type="text"
              placeholder="first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Box>
          <Box my={1}>
            <Label htmlFor="surname">Surname</Label>
            <Input
              id="surname"
              name="surname"
              type="text"
              placeholder="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </Box>
          <Box my={1}>
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
          <Box my={1}>
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
          <Box my={1}>
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="confirm password"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
            />
          </Box>
          <Button bg="#66CDAA">Sign Up</Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SignUpPage;
