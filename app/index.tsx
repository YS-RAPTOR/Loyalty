import { Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                gap: 16,
                padding: 16,
            }}
        >
            <MainButton
                link="/scan"
                text="Scan QR Code"
                icon="qr-code-scanner"
                color="#fcfc99"
            />
            <MainButton
                link="/search"
                text="Search Customers"
                color="#a8e4ef"
                icon="search"
            />
            <MainButton
                text="Add Customer"
                link="/customer/add"
                color="#79de79"
                icon="person-add"
            />
            <MainButton
                link="/admin"
                text="Admin Panel"
                color="#fb6962"
                icon="admin-panel-settings"
            />
        </View>
    );
}

const MainButton = (props: {
    link: React.ComponentProps<typeof Link>["href"];
    text: string;
    icon: React.ComponentProps<typeof MaterialIcons>["name"];
    color: string;
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
            onPress={() => {
                router.navigate(props.link);
            }}
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
