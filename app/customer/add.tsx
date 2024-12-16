import { EditableCustomer } from "@/components/editableCustomer";
import { Alert, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import * as Crypto from "expo-crypto";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { router } from "expo-router";
import { UuidTool } from "uuid-tool";

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
                <Ionicons name="person-circle-sharp" size={250}></Ionicons>
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

                    return Alert.alert(
                        "Add Customer",
                        "Are you sure you wnat to add this customer? Are all customer details correct?",
                        [
                            {
                                text: "Yes",
                                onPress: () => {
                                    const idString = Crypto.randomUUID();
                                    const id = UuidTool.toBytes(idString);

                                    try {
                                        if (phoneNumber === undefined) {
                                            db.runSync(
                                                `
                                                    INSERT INTO customers (id, first_name, last_name, email)
                                                    VALUES (?, ?, ?, ?);
                                                `,
                                                [
                                                    id,
                                                    firstName,
                                                    lastName,
                                                    email,
                                                ],
                                            );
                                        } else {
                                            db.runSync(
                                                `
                                                    INSERT INTO customers (id, first_name, last_name, email, phone_number)
                                                    VALUES (?, ?, ?, ?, ?);
                                                `,
                                                [
                                                    id,
                                                    firstName,
                                                    lastName,
                                                    email,
                                                    phoneNumber,
                                                ],
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
                                            setError(
                                                "An error occurred: " +
                                                    e.message,
                                            );
                                        }
                                        return;
                                    }
                                    router.replace({
                                        pathname: "/customer/[id]",
                                        params: {
                                            id: idString,
                                        },
                                    });
                                },
                            },
                            {
                                text: "No",
                            },
                        ],
                    );
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
