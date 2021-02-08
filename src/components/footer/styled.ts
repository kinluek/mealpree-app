import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

export const StyledFooter = withTheme(styled.div`
  background-color: ${p => p.theme.palette.background.paper};
  padding: ${p => p.theme.spacing(6)}px;
`);
