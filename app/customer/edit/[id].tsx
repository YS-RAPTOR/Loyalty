import { EditableCustomer } from "@/components/editableCustomer";
import { Alert, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import * as Crypto from "expo-crypto";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { router, useLocalSearchParams } from "expo-router";
import { UuidTool } from "uuid-tool";

type Customer = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
};

export default function Add() {
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams();

    // @ts-ignore
    const idBytes = UuidTool.toBytes(id);
    const [error, setError] = useState("");

    const customer = db.getFirstSync<Customer>(
        `
        SELECT first_name, last_name, email, phone_number
        FROM customers
        WHERE id = ?;
    `,
        // @ts-ignore
        [idBytes],
    );

    if (!customer) {
        return (
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                    }}
                >
                    No Customer Found
                </Text>
            </View>
        );
    }

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
                icon="save"
                initialFirstName={customer.first_name}
                initialLastName={customer.last_name}
                initialEmail={customer.email}
                initialPhoneNumber={customer.phone_number}
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
                    setError("");

                    try {
                        db.runSync(
                            `
                            UPDATE customers
                            SET first_name = ?, last_name = ?, email = ?, phone_number = ?
                            WHERE id = ?;
                        `,
                            [
                                firstName,
                                lastName ?? null,
                                email ?? null,
                                phoneNumber,
                                // @ts-ignore
                                idBytes,
                            ],
                        );
                    } catch (error) {
                        const e = error as Error;
                        if (e.message.includes("UNIQUE constraint failed: ")) {
                            if (e.message.includes("email")) {
                                setError("Email already exists.");
                            } else if (e.message.includes("phone_number")) {
                                setError("Phone number already exists.");
                            }
                        } else {
                            setError("An error occurred: " + e.message);
                        }
                        return;
                    }
                    router.dismiss();
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
