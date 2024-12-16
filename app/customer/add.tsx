import { EditableCustomer } from "@/components/editableCustomer";
import { Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import * as Crypto from "expo-crypto";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { router } from "expo-router";

export default function Add() {
    const db = useSQLiteContext();
    const [required, setRequired] = useState(false);
    const [error, setError] = useState("");

    return (
        <KeyboardAwareScrollView
            bottomOffset={62}
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

            <EditableCustomer
                icon="add"
                onPress={(firstName, lastName, email, phoneNumber) => {
                    setError("");
                    if (
                        firstName === undefined ||
                        lastName === undefined ||
                        email === undefined ||
                        firstName === "" ||
                        lastName === "" ||
                        email === ""
                    ) {
                        setRequired(true);
                        return;
                    }
                    setRequired(false);

                    const idString = Crypto.randomUUID();
                    const id = uuidToBytes(idString);

                    try {
                        if (phoneNumber === undefined) {
                            db.runSync(
                                `
                            INSERT INTO customers (id, first_name, last_name, email)
                            VALUES (?, ?, ?, ?);
                        `,
                                [id, firstName, lastName, email],
                            );
                        } else {
                            db.runSync(
                                `
                            INSERT INTO customers (id, first_name, last_name, email, phone_number)
                            VALUES (?, ?, ?, ?, ?);
                        `,
                                [id, firstName, lastName, email, phoneNumber],
                            );
                        }
                    } catch (error) {
                        const e = error as Error;
                        if (
                            e.message.includes(
                                "UNIQUE constraint failed: customers.email",
                            )
                        ) {
                            setError("Email already exists.");
                        } else {
                            setError("An error occurred: " + e.message);
                        }
                        return;
                    }
                    router.replace({
                        pathname: "/customer/[id]",
                        params: {
                            id: idString,
                        },
                    });
                }}
            />
            {required && (
                <Text
                    style={{
                        fontSize: 12,
                        color: "red",
                        fontWeight: "bold",
                    }}
                >
                    First Name, Last Name, and Email are required.
                </Text>
            )}
            {error != "" && (
                <Text
                    style={{
                        fontSize: 12,
                        color: "red",
                        fontWeight: "bold",
                    }}
                >
                    {error}
                </Text>
            )}
        </KeyboardAwareScrollView>
    );
}
