import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No access to camera</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    {" "}
                    You need permission to access Camera
                </Text>

                <Pressable
                    style={({ pressed }) => [
                        {
                            opacity: pressed ? 0.8 : 1,
                            backgroundColor: "#fcfc99",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 4,
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderWidth: 2,
                        },
                    ]}
                    onPress={requestPermission}
                >
                    <Text
                        style={{
                            fontSize: 16,
                        }}
                    >
                        Grant Permission
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={{
                    flexGrow: 1,
                    width: "100%",
                }}
                facing="back"
                onBarcodeScanned={(data) => {
                    router.replace({
                        pathname: "/customer/[id]",
                        params: {
                            id: data.data,
                        },
                    });
                }}
            ></CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
