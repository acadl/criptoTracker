import { Text as RText } from 'react-native-paper';

const RnpText = ({ children, ...props }) => (
  <RText {...props}>
    {children}
  </RText>
);

export default RnpText;