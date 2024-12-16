import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { EditableCustomer } from "@/components/editableCustomer";
import { useSQLiteContext } from "expo-sqlite";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { UuidTool } from "uuid-tool";

type Customer = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
};

export default function Search() {
    const [showHint, setShowHint] = useState(true);
    const [data, setData] = useState<Customer[]>([]);
    const db = useSQLiteContext();

    const statement = db.prepareSync(`
        SELECT id, first_name, last_name, email, phone_number
        FROM customers
        WHERE 
            ($firstName IS NULL OR lower(first_name) = lower($firstName)) AND
            ($lastName IS NULL OR lower(last_name) = lower($lastName)) AND
            ($eMail IS NULL OR lower(email) = lower($eMail)) AND
            ($phoneNumber IS NULL OR lower(phone_number) = lower($phoneNumber));
    `);

    return (
        <View
            style={{
                flex: 1,
                padding: 16,
                gap: 10,
            }}
        >
            <EditableCustomer
                icon="search"
                onPress={(firstName, lastName, email, phoneNumber) => {
                    setShowHint(false);

                    const d = statement.executeSync<Customer>({
                        // @ts-ignore
                        $firstName: firstName == "" ? null : firstName,
                        $lastName: lastName == "" ? null : lastName,
                        $eMail: email == "" ? null : email,
                        $phoneNumber: phoneNumber == "" ? null : phoneNumber,
                    });
                    setData(d.getAllSync());
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
            <FlatList
                style={{
                    gap: 16,
                }}
                data={data}
                renderItem={({ item }) => (
                    <Pressable
                        style={({ pressed }) => [
                            {
                                padding: 10,
                                borderWidth: 1,
                                borderRadius: 4,
                                flexDirection: "row",
                                gap: 8,
                                alignItems: "center",
                                backgroundColor: pressed
                                    ? "#ddd"
                                    : "transparent",
                            },
                        ]}
                        onPress={() => {
                            router.navigate({
                                pathname: "/customer/[id]",
                                params: {
                                    id: UuidTool.toString(
                                        item.id
                                            .substring(1, item.id.length - 1)
                                            .split(",")
                                            .map((x) => parseInt(x)),
                                    ),
                                },
                            });
                        }}
                    >
                        <Ionicons name="person-circle-sharp" size={40} />
                        <View>
                            <Text style={styles.text}>
                                Name: {item.first_name} {item.last_name}
                            </Text>
                            <Text style={styles.text}>Email: {item.email}</Text>
                            {item.phone_number && (
                                <Text style={styles.text}>
                                    Phone Number: {item.phone_number}
                                </Text>
                            )}
                        </View>
                    </Pressable>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            ></FlatList>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        fontWeight: "semibold",
    },
});
