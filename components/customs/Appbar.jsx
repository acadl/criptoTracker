import * as React from 'react';
import { Appbar as RnpAppbar } from 'react-native-paper';

const Appbar = (props) => (
  <RnpAppbar.Header>
    {props.onBack && <RnpAppbar.BackAction onPress={props.onBack} />}
    <RnpAppbar.Content title={props.title} />
    {
        props.icons && props.icons.map((icon, index) => {
            return <RnpAppbar.Action key={index} icon={icon.name} onPress={icon.onPress} />
        })
    }
  </RnpAppbar.Header>
);

export default Appbar;