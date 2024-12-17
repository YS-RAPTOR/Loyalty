import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Text, View } from "react-native";

type Offer = {
    id: number;
    product: string;
    frequency: number;
    discount: number;
};

export default function OfferView() {
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams();
    const statement = db.prepareSync(`
        SELECT * FROM offers WHERE id = ?;
    `);

    // @ts-ignore
    const offers: Offer = statement.executeSync<Offer>([id]).getFirstSync();

    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            }}
        >
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                }}
            >
                The customer is entitled to a {offers.discount * 100}% discount
                on the product {offers.product}.
            </Text>
        </View>
    );
}
