import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { View } from "react-native";

const InitData = async (db: SQLiteDatabase) => {};

export default function RootLayout() {
    return (
        <SQLiteProvider databaseName="loyalty.db" onInit={InitData}>
            <Stack>
                <Stack.Screen name="index" options={{ title: "Home" }} />
                <Stack.Screen name="scan" options={{ title: "Scan Code" }} />
                <Stack.Screen name="admin" options={{ title: "Admin Panel" }} />
                <Stack.Screen
                    name="search"
                    options={{ title: "Search Customer Database" }}
                />
                <Stack.Screen
                    name="customer/add"
                    options={{ title: "Add Customer" }}
                />
                <Stack.Screen
                    name="customer/edit/[id]"
                    options={{ title: "Edit Customer Details" }}
                />
            </Stack>
            <Database />
        </SQLiteProvider>
    );
}

const Database = () => {
    const db = useSQLiteContext();
    useDrizzleStudio(db);

    return <View />;
};
