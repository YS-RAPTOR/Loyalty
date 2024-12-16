import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

const InitData = async (db: SQLiteDatabase) => {
    // Check if a table exists
    const exists = db.getFirstSync(`
        SELECT name 
        FROM sqlite_master 
        WHERE type='table' AND name='users';
    `);

    // If not seed the database
    if (!exists) {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY NOT NULL DEFAULT 'admin',
                password TEXT NOT NULL DEFAULT 'admin'
            );
            CREATE TABLE customers (
                id BLOB PRIMARY KEY,        
                first_name TEXT NOT NULL,   
                last_name TEXT NOT NULL,    
                email TEXT UNIQUE NOT NULL,
                phone_number TEXT,          
                last_offer INTEGER
            );
            CREATE TABLE offers (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                product TEXT NOT NULL,              
                frequency INTEGER NOT NULL,              
                discount REAL NOT NULL                
            );
            INSERT INTO users (username, password)
            VALUES ('admin', 'admin');
        `);
    }
};

export default function RootLayout() {
    return (
        <SQLiteProvider databaseName="loyalty.db" onInit={InitData}>
            <KeyboardProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ title: "Home" }} />
                    <Stack.Screen
                        name="scan"
                        options={{ title: "Scan Code" }}
                    />
                    <Stack.Screen
                        name="admin"
                        options={{ title: "Admin Panel" }}
                    />
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
            </KeyboardProvider>
        </SQLiteProvider>
    );
}

const Database = () => {
    const db = useSQLiteContext();
    useDrizzleStudio(db);

    return <View />;
};
