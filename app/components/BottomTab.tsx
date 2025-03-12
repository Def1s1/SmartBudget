import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


type TabButtonProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    route: string;
};

export default function BottomTab() {
    const router = useRouter();
    const pathname = usePathname() as string; 

    const TabButton = ({ icon, label, route }: TabButtonProps) => (
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push(route)}>
            <Ionicons name={icon} size={24} color={pathname === route ? '#5A55FF' : '#888'} />
            <Text style={[styles.tabText, pathname === route && { color: '#5A55FF' }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.bottomTab}>
            <TabButton icon="home" label="Home" route="/" />
            <TabButton icon="wallet" label="Wallet" route="/wallet" />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/transaction')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <TabButton icon="bar-chart" label="Stats" route="/stats" />
            <TabButton icon="settings" label="Settings" route="/settings" />
        </View>
    );
}

const styles = StyleSheet.create({
    bottomTab: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    tabItem: {
        alignItems: 'center',
    },
    tabText: {
        fontSize: 12,
        color: '#888',
        marginTop: 3,
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#5A55FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
});
