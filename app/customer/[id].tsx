import { Auth } from "@/components/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { UuidTool } from "uuid-tool";

type Customer = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    last_offer?: number;
};

export default function ViewCustomer() {
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams();
    const [open, setOpen] = useState(false);

    // @ts-ignore
    const idBytes = UuidTool.toBytes(id);
    const customer = db.getFirstSync<Customer>(
        `
        SELECT first_name, last_name, email, phone_number, last_offer
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
            style={{
                flex: 1,
                padding: 16,
            }}
            contentContainerStyle={{
                gap: 16,
            }}
        >
            <Auth
                onAuthenticated={() => {
                    // Undo last offer
                    try {
                        db.runSync(
                            `
                            UPDATE customers
                            set offer_${customer.last_offer} = offer_${customer.last_offer} - 1
                            WHERE id = ?;
                        `,
                            // @ts-ignore
                            [idBytes],
                        );
                    } catch (error) {}

                    db.runSync(
                        `
                        UPDATE customers
                        SET last_offer = NULL
                        WHERE id = ?;
                                            `,
                        // @ts-ignore
                        [idBytes],
                    );
                    setOpen(false);
                    router.replace({
                        pathname: "/customer/[id]",
                        // @ts-ignore
                        params: { id: id },
                    });
                }}
                open={open}
                setOpen={setOpen}
            />
            <View>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    First Name
                </Text>
                <Text
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                >
                    {customer.first_name}
                </Text>
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
                <Text
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                >
                    {customer.last_name}
                </Text>
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
                <Text
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4,
                    }}
                >
                    {customer.email}
                </Text>
            </View>
            {customer.phone_number && (
                <View>
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "bold",
                        }}
                    >
                        Phone Number
                    </Text>
                    <Text
                        style={{
                            borderWidth: 1,
                            borderColor: "black",
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 4,
                        }}
                    >
                        {customer.phone_number}
                    </Text>
                </View>
            )}
            <Offers id={idBytes} />
            <View
                style={{
                    gap: 5,
                    flexDirection: "row",
                }}
            >
                {customer.last_offer && (
                    <Pressable
                        style={({ pressed }) => [
                            {
                                backgroundColor: "#fb6962",
                                opacity: pressed ? 0.8 : 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 8,
                                flexGrow: 1,
                                padding: 8,
                            },
                        ]}
                        onPress={() => {
                            setOpen(true);
                        }}
                    >
                        <MaterialIcons name="undo" size={24} color="white" />
                    </Pressable>
                )}
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
                        router.navigate({
                            pathname: "/customer/share/[id]",
                            // @ts-ignore
                            params: { id: id },
                        });
                    }}
                >
                    <MaterialIcons name="share" size={24} color="white" />
                </Pressable>
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
                        router.navigate({
                            pathname: "/customer/edit/[id]",
                            params: {
                                // @ts-ignore
                                id: id,
                            },
                        });
                    }}
                >
                    <MaterialIcons name="edit" size={24} color="white" />
                </Pressable>
            </View>
        </KeyboardAwareScrollView>
    );
}
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

const Offers = (props: { id: number[] }) => {
    const db = useSQLiteContext();
    const statement = db.prepareSync(`
        SELECT * FROM offers;
    `);
    const offers: Offer[] = statement.executeSync<Offer>({}).getAllSync();

    return (
        <View
            style={{
                gap: 16,
            }}
        >
            {offers.map((item) => (
                <OfferView key={item.id} offer={item} id={props.id} />
            ))}
        </View>
    );
};

const OfferView = (props: { offer: Offer; id: number[] }) => {
    const db = useSQLiteContext();

    const customer = db.getFirstSync<any>(
        `SELECT first_name, offer_${props.offer.id} from customers where id = ?`,
        // @ts-ignore
        [props.id],
    );

    const remaining =
        props.offer.frequency -
        (customer[`offer_${props.offer.id}`] % props.offer.frequency);

    return (
        <Pressable
            style={({ pressed }) => [
                {
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 4,
                    flexDirection: "row",
                    gap: 8,
                    alignContent: "center",
                    backgroundColor: pressed ? "#ddd" : "transparent",
                },
            ]}
            onPress={() => {
                return Alert.alert(
                    "Are you sure?",
                    ` Are you sure you want to apply this offer (${props.offer.product}) to this customer?`,
                    [
                        {
                            text: "Yes",
                            onPress: () => {
                                // Increment the offer count
                                db.runSync(
                                    `
                                    UPDATE customers
                                    SET last_offer = ?, offer_${props.offer.id} = offer_${props.offer.id} + 1
                                    WHERE id = ?;
                                    
                                `,
                                    // @ts-ignore
                                    [props.offer.id, props.id],
                                );

                                const occurrences = db.getFirstSync(
                                    `SELECT offer_${props.offer.id} FROM customers WHERE id = ?`,
                                    // @ts-ignore
                                    [props.id],
                                );

                                // Check if the offer should be applied
                                if (
                                    // @ts-ignore
                                    occurrences[`offer_${props.offer.id}`] %
                                        props.offer.frequency ===
                                    0
                                ) {
                                    router.navigate({
                                        pathname: "/offer/[id]",
                                        params: {
                                            id: props.offer.id,
                                        },
                                    });
                                } else {
                                    router.dismiss();
                                }
                            },
                        },
                        { text: "No" },
                    ],
                );
            }}
        >
            <MaterialIcons name="local-offer" size={40} />
            <View>
                <Text style={styles.text}>Product: {props.offer.product}</Text>
                <Text style={styles.text}>
                    Discount of {props.offer.discount * 100}% applied every{" "}
                    {props.offer.frequency} orders.
                </Text>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "red",
                    }}
                >
                    {customer.first_name} is {remaining} away from the next
                    discount.
                </Text>
            </View>
        </Pressable>
    );
};
