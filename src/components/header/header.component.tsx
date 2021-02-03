import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/user.context';
import { auth } from '../../firebase/auth';
import './header.styles.scss';

const Header: React.FunctionComponent = () => {
  const { user, setUser } = useUserContext();

  const signOut = () => {
    auth
      .signOut()
      .then(() => setUser(null))
      .catch(console.log);
  };

  return (
    <div className="header">
      <Link className="logo-container" to="/">
        Mealpree
      </Link>
      <div className="options">
        {user ? (
          <div onClick={signOut}>Sign Out</div>
        ) : (
          <div>
            <Link className="option" to="/signup">
              Sign Up
            </Link>
            <Link className="option" to="/signin">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
