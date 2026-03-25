import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
    saveData: async (key, value) => {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    loadData: async (key) => {
        let result = await AsyncStorage.getItem(key);
        return result ? JSON.parse(result) : null
    },
    clearData: async (key) => {
        return await AsyncStorage.removeItem(key);
    },
}