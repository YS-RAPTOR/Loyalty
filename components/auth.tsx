import { MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

export const Auth = (props: {
    onAuthenticated: () => void;
    open: boolean;
    setOpen: (b: boolean) => void;
}) => {
    const db = useSQLiteContext();
    const password = db.getFirstSync<{ password: string }>(
        "SELECT password from users WHERE username = 'admin'",
    );

    const [enteredPassword, setEnteredPassword] = useState("");
    const [wrongPassword, setWrongPassword] = useState(false);

    return (
        <Modal
            visible={props.open}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#222",
                }}
            >
                <View
                    style={{
                        padding: 16,
                        backgroundColor: "white",
                        borderRadius: 8,
                        gap: 16,
                        width: "80%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                            }}
                        >
                            Enter password
                        </Text>
                        <Pressable
                            onPress={() => {
                                props.setOpen(false);
                            }}
                        >
                            <MaterialIcons
                                name="close"
                                size={30}
                                color="black"
                            />
                        </Pressable>
                    </View>

                    <View>
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "bold",
                            }}
                        >
                            Password
                        </Text>
                        <TextInput
                            secureTextEntry={true}
                            style={{
                                borderWidth: 1,
                                borderColor: "black",
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                borderRadius: 4,
                            }}
                            value={enteredPassword}
                            onChangeText={setEnteredPassword}
                        ></TextInput>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            {
                                opacity: pressed ? 0.8 : 1,
                                backgroundColor: "#fb6962",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 4,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                borderWidth: 2,
                            },
                        ]}
                        onPress={() => {
                            setWrongPassword(false);
                            if (enteredPassword === password!.password) {
                                props.onAuthenticated();
                                props.setOpen(false);
                            } else {
                                setWrongPassword(true);
                            }
                            setEnteredPassword("");
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                            }}
                        >
                            Login
                        </Text>
                    </Pressable>
                    {wrongPassword && (
                        <Text
                            style={{
                                fontSize: 12,
                                color: "red",
                                fontWeight: "bold",
                            }}
                        >
                            Wrong Password
                        </Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};
