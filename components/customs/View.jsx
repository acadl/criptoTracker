import { View as RView } from 'react-native';

const RnpView = ({ children, ...props }) => (
  <RView {...props}>
    {children}
  </RView>
);

export default RnpView;