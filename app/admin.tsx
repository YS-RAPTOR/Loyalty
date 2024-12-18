import { useSQLiteContext } from "expo-sqlite";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { router } from "expo-router";

type Offer = {
    id: number;
    product: string;
    frequency: number;
    discount: number;
};

const styles = StyleSheet.create({
    header: {
        fontSize: 16,
        fontWeight: "bold",
    },
    text: {
        fontSize: 12,
        fontWeight: "semibold",
    },
});

export default function Admin() {
    const db = useSQLiteContext();
    const statement = db.prepareSync(`
        SELECT * FROM offers;
    `);
    const offers: Offer[] = statement.executeSync<Offer>({}).getAllSync();

    return (
        <KeyboardAwareScrollView
            style={{
                padding: 16,
                flex: 1,
                gap: 10,
            }}
        >
            <ChangePassword></ChangePassword>
            <View style={{ height: 10 }}></View>
            <View
                style={{
                    gap: 16,
                }}
            >
                <Text style={styles.header}>Add Offers: </Text>
                <AddOffer />
                <Text style={styles.header}>Offers: </Text>

                <View
                    style={{
                        gap: 16,
                    }}
                >
                    {offers.map((item) => (
                        <OfferView key={item.id} {...item} />
                    ))}
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const AddOffer = () => {
    const [product, setProduct] = useState("");
    const [frequency, setFrequency] = useState("");
    const [discount, setDiscount] = useState("");
    const [error, setError] = useState("");
    const db = useSQLiteContext();

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
                    Product
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                    value={product}
                    onChangeText={setProduct}
                ></TextInput>
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Frequency
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                    value={frequency}
                    onChangeText={setFrequency}
                    keyboardType="numeric"
                ></TextInput>
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Discount
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                    value={discount}
                    onChangeText={setDiscount}
                    keyboardType="numeric"
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
                        setError("");

                        if (
                            product === "" ||
                            frequency === "" ||
                            discount === ""
                        ) {
                            setError("All fields are required.");
                            return;
                        }

                        const discountValue = parseFloat(discount);

                        if (
                            isNaN(discountValue) ||
                            discountValue <= 0 ||
                            discountValue > 1
                        ) {
                            setError(
                                "Discount must be a number between 0 and 1.",
                            );
                            return;
                        }

                        const frequencyValue = parseInt(frequency);

                        if (isNaN(frequencyValue) || frequencyValue <= 0) {
                            setError("Frequency must be a positive number.");
                            return;
                        }

                        const statement = db.prepareSync(`
                            INSERT INTO offers (product, frequency, discount)
                            VALUES (?, ?, ?);
                        `);

                        db.withTransactionSync(() => {
                            statement.executeSync([
                                product,
                                frequencyValue,
                                discountValue,
                            ]);

                            const offerId = db.getFirstSync<{
                                id: string;
                            }>(`
                                SELECT id 
                                FROM offers 
                                ORDER BY id DESC
                                LIMIT 1;
                            `);

                            db.execSync(
                                `ALTER TABLE customers ADD COLUMN ${"offer_" + offerId!.id} INTEGER DEFAULT 0;`,
                            );
                        });
                        router.replace("/admin");
                    }}
                >
                    <MaterialIcons name="add" size={24} color="white" />
                </Pressable>
            </View>
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
        </View>
    );
};

const ChangePassword = () => {
    const db = useSQLiteContext();
    const [password, setPassword] = useState("");
    const [retypePassword, setRetpyePassword] = useState("");

    return (
        <View
            style={{
                gap: 5,
            }}
        >
            <Text style={styles.header}>Account: </Text>
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    New Password
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                ></TextInput>
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Retype New Password
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                    secureTextEntry={true}
                    value={retypePassword}
                    onChangeText={setRetpyePassword}
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
                    if (password !== retypePassword) {
                        return Alert.alert("Error", "Passwords do not match");
                    }

                    const updatePassword = db.prepareSync(`
                        UPDATE users
                        SET password = ? 
                        WHERE username = 'admin';
                    `);
                    updatePassword.executeSync([password]);

                    setPassword("");
                    setRetpyePassword("");
                    alert("Password changed successfully.");
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                    }}
                >
                    Change Password
                </Text>
            </Pressable>
        </View>
    );
};

const OfferView = (props: Offer) => {
    const db = useSQLiteContext();
    return (
        <Pressable
            style={({ pressed }) => [
                {
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 4,
                    flexDirection: "row",
                    gap: 8,
                    alignpropss: "center",
                    backgroundColor: pressed ? "#fb6962" : "transparent",
                },
            ]}
            onPress={() => {
                return Alert.alert(
                    "Remove Offer",
                    "Are you sure you want to remove the offer for " +
                        props.product +
                        "?",
                    [
                        {
                            text: "Yes",
                            style: "destructive",
                            onPress: () => {
                                const statement = db.prepareSync(`
                                    DELETE FROM offers
                                    WHERE id = $id;
                                `);

                                statement.executeSync({
                                    $id: props.id,
                                });

                                db.execSync(
                                    `ALTER TABLE customers DROP COLUMN ${"offer_" + props.id};`,
                                );

                                router.replace("/admin");
                            },
                        },
                        {
                            text: "No",
                            style: "cancel",
                        },
                    ],
                );
            }}
        >
            <MaterialIcons name="local-offer" size={40} />
            <View>
                <Text style={styles.text}>Product: {props.product}</Text>
                <Text style={styles.text}>
                    Discount of {props.discount * 100}% applied every{" "}
                    {props.frequency} orders.
                </Text>
            </View>
        </Pressable>
    );
};
