import { useSQLiteContext } from "expo-sqlite";
import { Text, View } from "react-native";

export default function Admin() {
    const db = useSQLiteContext();

    const exists = db.getFirstSync(`
        SELECT name 
        FROM sqlite_master 
        WHERE type='table' AND name='users';
`);

    return (
        <View>
            <Text>{exists as string}</Text>
            <Text>{typeof exists}</Text>
            <Text>{Object.values(exists as Object)}</Text>
        </View>
    );
}

const Offer = () => {};
