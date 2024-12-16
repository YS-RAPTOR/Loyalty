import { Pressable, Text, TextInput, View } from "react-native";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const EditableCustomer = (props: {
    initialFirstName?: string;
    initialLastName?: string;
    initialEmail?: string;
    initialPhoneNumber?: string;
    icon: React.ComponentProps<typeof MaterialIcons>["name"];
    onPress: (
        firstName: string | undefined,
        lastName: string | undefined,
        email: string | undefined,
        phoneNumber: string | undefined,
    ) => void;
}) => {
    const [firstName, setFirstName] = useState<string | undefined>(
        props.initialFirstName,
    );
    const [lastName, setLastName] = useState<string | undefined>(
        props.initialLastName,
    );
    const [email, setEmail] = useState<string | undefined>(props.initialEmail);
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(
        props.initialPhoneNumber,
    );

    return (
        <View
            style={{
                gap: 5,
            }}
        >
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    First Name
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                    value={firstName}
                    onChangeText={setFirstName}
                ></TextInput>
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Last Name
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                    value={lastName}
                    onChangeText={setLastName}
                ></TextInput>
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Email
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                ></TextInput>
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Phone Number
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                ></TextInput>
            </View>

            <View
                style={{
                    gap: 5,
                    flexDirection: "row",
                }}
            >
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: "black",
                            opacity: pressed ? 0.8 : 1,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 8,
                            flexGrow: 1,
                            padding: 8,
                        },
                    ]}
                    onPress={() => {
                        props.onPress(firstName, lastName, email, phoneNumber);
                    }}
                >
                    <MaterialIcons name={props.icon} size={24} color="white" />
                </Pressable>
            </View>
        </View>
    );
};
