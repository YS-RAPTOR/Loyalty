import { FlatList, Text, View } from "react-native";
import { useState } from "react";
import { EditableCustomer } from "@/components/editableCustomer";

export default function Search() {
    const [showHint, setShowHint] = useState(true);
    const [data, setData] = useState<any[]>([]);

    // TODO: Implement searching a customer
    return (
        <View
            style={{
                flex: 1,
                padding: 16,
            }}
        >
            <EditableCustomer
                icon="search"
                onPress={() => {
                    setShowHint(false);
                }}
            />
            {showHint && (
                <Text
                    style={{
                        fontSize: 12,
                        color: "gray",
                        fontWeight: "bold",
                    }}
                >
                    The following combinations are often effective for producing
                    unique results: (First Name + Last Name), (Email Address),
                    or (Phone Number).
                </Text>
            )}
            {/* <FlatList */}
            {/**/}
            {/* ></FlatList> */}
        </View>
    );
}
