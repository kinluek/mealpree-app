import { Link } from 'react-router-dom';
import { Flex, Text } from 'rebass';
import { useUserContext } from '../../context/user.context';
import { auth } from '../../firebase/auth';

const Header: React.FunctionComponent = () => {
  const { user } = useUserContext();

  const signOut = () => {
    auth.signOut().catch(console.log);
  };

  return (
    <Flex color="white" bg="#66CDAA" justifyContent="space-between">
      <Link to="/">
        <Text p={2} fontWeight="bold" color="white">
          mealpree
        </Text>
      </Link>
      {user ? (
        <Flex>
          <Text onClick={signOut}>Sign Out</Text>
        </Flex>
      ) : (
        <Flex>
          <Link to="/signup">
            <Text p={2} fontWeight="bold" color="white">
              Sign Up
            </Text>
          </Link>
          <Link to="/signin">
            <Text p={2} fontWeight="bold" color="white">
              Sign In
            </Text>
          </Link>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
