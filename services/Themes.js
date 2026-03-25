import {
    MD3DarkTheme,
    MD3LightTheme
} from 'react-native-paper';

const light = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#136220',
        secondary: '#34ba56',
        tertiary: '#53d594',
    },
};

const dark = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#058b8b',
        secondary: '#3d34ba',
        tertiary: '#6753d5',
    },
};

export default {
    dark,
    light
}