import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Pressable, Text } from "react-native";

import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { UuidTool } from "uuid-tool";

import * as SMS from "expo-sms";
import * as MailComposer from "expo-mail-composer";
import * as FileSystem from "expo-file-system";
import { File, Paths } from "expo-file-system/next";
import { useState } from "react";

export default function Share() {
    const { id } = useLocalSearchParams();

    const db = useSQLiteContext();

    // @ts-ignore
    const idBytes = UuidTool.toBytes(id);

    const customer = db.getFirstSync<{
        first_name: string;
        phone_number: string;
        email?: string;
    }>(
        `
        SELECT phone_number, email, first_name
        FROM customers
        WHERE id = ?;
    `,
        // @ts-ignore
        [idBytes],
    );

    const [state, setState] = useState<string | null>(null);
    const [error, setError] = useState<string>("");

    const createQrCodeFile = (): File | undefined => {
        try {
            if (!state || state === null) {
                alert("QR code not ready! Please try again.");
            }

            const file = new File(Paths.cache, "qr.png");
            if (file.exists) {
                file.delete();
            }
            file.create();
            file.write(base64toUint8Array(state!));

            return file;
        } catch (error) {
            alert("Error saving QR code to file: " + error);
        }

        return undefined;
    };

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

    const subject = "Loyalty Code: Triple Tea Caffe";
    const message = `Hi ${customer?.first_name}!
Thank you for signing up with our loyalty scheme. Please scan this code whenever you shop with us. 
Chears Team Triple Tea Caffe.`;

    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                gap: 16,
            }}
        >
            <QRCode
                // @ts-ignore
                value={id}
                size={250}
                quietZone={25}
                getRef={(ref) => {
                    if (ref) {
                        ref.toDataURL((data: string) => setState(data));
                    }
                }}
            />
            <View
                style={{
                    gap: 5,
                    flexDirection: "row",
                    width: 225,
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
                            padding: 10,
                            flexGrow: 1,
                        },
                    ]}
                    onPress={async () => {
                        const file = createQrCodeFile();
                        if (!file) {
                            return;
                        }

                        await SMS.sendSMSAsync(customer.phone_number, message, {
                            attachments: {
                                uri: await FileSystem.getContentUriAsync(
                                    file.uri,
                                ),
                                mimeType: file.type!,
                                filename: file.name,
                            },
                        });
                    }}
                >
                    <MaterialIcons name="sms" size={24} color="white" />
                </Pressable>

                {customer.email && (
                    <Pressable
                        style={({ pressed }) => [
                            {
                                backgroundColor: "black",
                                opacity: pressed ? 0.8 : 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 8,
                                padding: 10,
                                flexGrow: 1,
                            },
                        ]}
                        onPress={async () => {
                            const file = createQrCodeFile();
                            if (!file) {
                                return;
                            }

                            await MailComposer.composeAsync({
                                recipients: [customer.email!],
                                subject: subject,
                                body: message,
                                attachments: [file.uri],
                            });
                        }}
                    >
                        <MaterialIcons name="mail" size={24} color="white" />
                    </Pressable>
                )}
            </View>
            <Text>{error}</Text>
        </View>
    );
}

const base64toUint8Array = (base64: string): Uint8Array => {
    const binary_string = atob(base64);
    var bytes = new Uint8Array(binary_string.length);
    for (var i = 0; i < binary_string.length; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
};
