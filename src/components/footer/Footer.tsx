import React from 'react';
import Typography from '@material-ui/core/Typography';
import { StyledFooter } from "./styled";

export interface Props {
  label?: string;
}

export const Footer = ({label}: Props) => (
  <StyledFooter>
    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
      {label}
    </Typography>
  </StyledFooter>
);

export default Footer;
