import { Button as RnpButton } from 'react-native-paper';

const Button = ({ children, ...props }) => (
  <RnpButton {...props}>
    {children}
  </RnpButton>
);

export default Button;