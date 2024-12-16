import { FlatList, Text, View } from "react-native";
import { useState } from "react";
import { EditableCustomer } from "@/components/editableCustomer";
import { useSQLiteContext } from "expo-sqlite";

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
                data={data}
                renderItem={({ item }) => (
                    <Text>
                        {item.first_name} {item.last_name}
                    </Text>
                )}
            ></FlatList>
        </View>
    );
}
