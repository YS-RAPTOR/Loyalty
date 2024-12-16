import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
                        // TODO: Undo last offer
                    }}
                >
                    <MaterialIcons name="undo" size={24} color="white" />
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
                        // TODO: Share qr code
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
                // TODO: Increment offer
            }}
        >
            <MaterialIcons name="local-offer" size={40} />
            <View>
                <Text style={styles.text}>Product: {props.offer.product}</Text>
                <Text style={styles.text}>
                    Discount of {props.offer.discount * 100}% applied every{" "}
                    {props.offer.frequency} orders.
                </Text>
            </View>
        </Pressable>
    );
};
