import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function View() {
    const { id } = useLocalSearchParams();
    return <Text>View: {id}</Text>;
}
