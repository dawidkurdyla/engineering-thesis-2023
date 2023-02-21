import * as SecureStore from "expo-secure-store";

class Storage {
    static storeTokens = async (tokens) => {
        await SecureStore.setItemAsync('tokens', JSON.stringify(tokens));
    }

    static getTokens = async () => {
        tokens = await SecureStore.getItemAsync('tokens');
        return JSON.parse(tokens);
    }

    static clearTokens = async () => {
        SecureStore.deleteItemAsync('tokens');
    }
}

export default Storage