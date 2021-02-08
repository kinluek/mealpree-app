import React from 'react';
import { useHistory } from 'react-router';
import { useUserContext } from '../../context/user.context';
import { auth } from '../../firebase/auth';
import { StyledHeader, StyledToolbar, StyledLogoContainer, StyledLogo, StyledLogInOutButton } from './styled';

export const Header = () => {
  const history = useHistory();

  const { userState } = useUserContext();

  const signOut = () => {
    return auth
      .signOut()
      .then(() => history.push('/'))
      .catch(console.log);
  };

  return (
    <StyledHeader position="static" color="default" elevation={0}>
      <StyledToolbar>
        <StyledLogoContainer>
          <StyledLogo onClick={() => history.push('/')} variant="h6" color="inherit">
            mealpree
          </StyledLogo>
        </StyledLogoContainer>
        {!userState ? (
          <StyledLogInOutButton onClick={() => history.push('/signin')} color="primary" variant="outlined">
            Login
          </StyledLogInOutButton>
        ) : (
          <StyledLogInOutButton onClick={signOut} color="primary" variant="outlined">
            Logout
          </StyledLogInOutButton>
        )}
      </StyledToolbar>
    </StyledHeader>
  );
};

export default Header;
