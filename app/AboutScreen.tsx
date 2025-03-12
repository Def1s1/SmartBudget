import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>About the App</Text>
            <Text style={styles.description}>
                EasyBudget is a simple budget management app that helps you track your income and expenses.
            </Text>
            <Text style={styles.description}>
                You can view your daily transactions, set financial goals, and monitor your spending.
            </Text>
            <Text style={styles.footer}>
                Version 1.0.0
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        lineHeight: 22,
    },
    footer: {
        marginTop: 20,
        fontSize: 14,
        color: '#aaa',
    },
});
