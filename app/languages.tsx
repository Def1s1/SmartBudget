import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const currencies = [
    { code: 'US', name: 'English' },
    { code: 'UK', name: 'English' },
    { code: 'UA', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'CNY', name: 'Chinese Yuan' },
];

export default function CurrencySelectionScreen() {
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
    const router = useRouter();

    const handleSelect = (code: string) => {
        setSelectedCurrency(code);
    };

    const handleNext = () => {
        console.log('Selected Currency:', selectedCurrency);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose Your Language</Text>
            <FlatList
                data={currencies}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.currencyItem,
                            item.code === selectedCurrency && styles.selectedCurrency,
                        ]}
                        onPress={() => handleSelect(item.code)}
                    >
                        <Text style={styles.currencyText}>
                            {item.code} - {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
                style={[styles.nextButton, !selectedCurrency && styles.disabledButton]}
                disabled={!selectedCurrency}
                onPress={handleNext}
            >
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    currencyItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
    },
    selectedCurrency: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    currencyText: {
        fontSize: 16,
        color: '#333',
    },
    nextButton: {
        marginTop: 40,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        position: 'absolute',
        bottom: 40, 
        left: 20,
        right: 20,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    nextButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
