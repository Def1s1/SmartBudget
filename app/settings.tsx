import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

    const handleNavigateToCurrency = () => {
        router.push('/currency');
    };

    const handleNavigateToLanguage = () => {
        router.push('/languages');
    };

    const handleNavigateToAbout = () => {
        router.push('/AboutScreen');
    };

    const handleNavigateToReview = () => {
        router.push('/ReviewScreen');
    };

    const toggleNotifications = () => {
        setNotificationsEnabled((prev) => !prev);
    };

    const handleShareApp = async () => {
        try {
            await Share.share({
                message: 'Check out this awesome app! Download it now: [App Link]',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>System Settings</Text>

                <TouchableOpacity style={styles.row} onPress={handleNavigateToCurrency}>
                    <Text style={styles.rowLabel}>Currency</Text>
                    <View style={styles.rowRight}>
                        <Text style={styles.rowValue}>USD</Text>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={handleNavigateToLanguage}>
                    <Text style={styles.rowLabel}>Language</Text>
                    <View style={styles.rowRight}>
                        <Text style={styles.rowValue}>Ukrainian</Text>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy</Text>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={toggleNotifications}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Additional</Text>

                <TouchableOpacity style={styles.row} onPress={handleNavigateToAbout}>
                    <Text style={styles.rowLabel}>About the App</Text>
                    <Ionicons name="chevron-forward" size={20} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={handleNavigateToReview}>
                    <Text style={styles.rowLabel}>Rate the App</Text>
                    <Ionicons name="star" size={20} color="#ffcc00" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={handleShareApp}>
                    <Text style={styles.rowLabel}>Tell Friends</Text>
                    <Ionicons name="share-social" size={20} color="#1E90FF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rowLabel: {
        fontSize: 16,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowValue: {
        fontSize: 16,
        color: '#888',
        marginRight: 5,
    },
});
