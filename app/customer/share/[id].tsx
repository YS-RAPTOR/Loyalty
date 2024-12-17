import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Share() {
    const { id } = useLocalSearchParams();

    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            }}
        >
            {/* @ts-ignore */}
            <QRCode value={id} />
        </View>
    );
}
