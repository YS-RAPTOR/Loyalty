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
                        firstName === "" ||
                        phoneNumber === undefined ||
                        phoneNumber === ""
                    ) {
                        setError("First Name and Phone Number are required.");
                        return;
                    }

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
                                        db.runSync(
                                            `
                                                    INSERT INTO customers (id, first_name, last_name, email, phone_number)
                                                    VALUES (?, ?, ?, ?, ?);
                                                `,
                                            [
                                                // @ts-ignore
                                                id,
                                                firstName,
                                                lastName ?? null,
                                                email ?? null,
                                                phoneNumber,
                                            ],
                                        );
                                    } catch (error) {
                                        const e = error as Error;
                                        if (
                                            e.message.includes(
                                                "UNIQUE constraint failed: ",
                                            )
                                        ) {
                                            if (e.message.includes("email")) {
                                                setError(
                                                    "Email already exists.",
                                                );
                                            } else if (
                                                e.message.includes(
                                                    "phone_number",
                                                )
                                            ) {
                                                setError(
                                                    "Phone number already exists.",
                                                );
                                            }
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
