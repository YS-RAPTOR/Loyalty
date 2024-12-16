import { Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import { Auth } from "@/components/auth";
import { useState } from "react";

export default function Index() {
    const [open, setOpen] = useState(false);

    return (
        <View
            style={{
                flex: 1,
                gap: 16,
                padding: 16,
            }}
        >
            <MainButton
                text="Scan QR Code"
                icon="qr-code-scanner"
                color="#fcfc99"
                onPress={() => {
                    router.navigate("/scan");
                }}
            />
            <MainButton
                text="Search Customers"
                color="#a8e4ef"
                icon="search"
                onPress={() => {
                    router.navigate("/search");
                }}
            />
            <MainButton
                text="Add Customer"
                color="#79de79"
                icon="person-add"
                onPress={() => {
                    router.navigate("/customer/add");
                }}
            />
            <MainButton
                text="Admin Panel"
                color="#fb6962"
                icon="admin-panel-settings"
                onPress={() => {
                    setOpen(true);
                }}
            />
            <Auth
                onAuthenticated={() => {
                    router.navigate("/admin");
                }}
                open={open}
                setOpen={setOpen}
            />
        </View>
    );
}

const MainButton = (props: {
    text: string;
    icon: React.ComponentProps<typeof MaterialIcons>["name"];
    color: string;
    onPress?: () => void;
}) => {
    return (
        <Pressable
            style={({ pressed }) => [
                {
                    opacity: pressed ? 0.8 : 1,
                    backgroundColor: props.color,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                    flexGrow: 1,
                },
            ]}
            onPress={props.onPress}
        >
            <MaterialIcons name={props.icon} size={40} color="black" />
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "bold",
                }}
            >
                {props.text}
            </Text>
        </Pressable>
    );
};
