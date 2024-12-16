import { EditableCustomer } from "@/components/editableCustomer";
import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Add() {
    // TODO: Implement adding a customer

    return (
        <View
            style={{
                flex: 1,
                padding: 16,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                }}
            >
                <MaterialIcons name="person-pin" size={250}></MaterialIcons>
            </View>

            <EditableCustomer icon="add" onPress={() => {}} />
        </View>
    );
}
