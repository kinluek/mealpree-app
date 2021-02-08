import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

export const StyledHeader = withTheme(styled(AppBar)`
  border-bottom: 1px solid ${p => p.theme.palette.divider};
`);

export const StyledToolbar = withTheme(styled(Toolbar)`
  flex-wrap: wrap;
`);

export const StyledLogoContainer = withTheme(styled.div`
  flex-grow: 1;
`);

export const StyledLogo = withTheme(styled(Typography)`
  display: inline-block;

  &:hover {
    cursor: pointer;
  }
`);

export const StyledLogInOutButton = withTheme(styled(Button)`
  margin: ${p => p.theme.spacing(1, 1.5)};
`);
