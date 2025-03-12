import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Transaction = {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: string;  
};

const TRANSACTIONS_KEY = 'user_transactions';

const TransactionCalendar = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
            const loadedTransactions = data ? JSON.parse(data) : [];
            setTransactions(loadedTransactions);
        } catch (error) {
            console.error('Failed to load transactions', error);
        }
    };

    const markedDates = getMarkedDates(transactions, selectedDate);

    const handleDayPress = (day: DateData) => {
        const { dateString } = day;
        setSelectedDate(dateString);

        const dailyTransactions = transactions.filter(t => t.date === dateString);
        const total = dailyTransactions.reduce((sum, t) => {
            return sum + (t.type === 'expense' ? -t.amount : t.amount);
        }, 0);

        setSelectedAmount(total);
    };

    return (
        <View style={styles.container}>
            <Calendar
                markingType="custom"
                markedDates={markedDates}
                onDayPress={handleDayPress}
            />

            {}
            {selectedDate && selectedAmount !== null && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>
                        {`Total for ${selectedDate}: `}
                        <Text style={{ color: selectedAmount >= 0 ? 'green' : 'red' }}>
                            {selectedAmount >= 0 ? '+' : ''}{selectedAmount.toFixed(2)}
                        </Text>
                    </Text>
                </View>
            )}
        </View>
    );
};

const getMarkedDates = (transactions: Transaction[], selectedDate: string | null) => {
    const dailyTotals: Record<string, number> = {};

    transactions.forEach(transaction => {
        if (!dailyTotals[transaction.date]) {
            dailyTotals[transaction.date] = 0;
        }
        const amount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
        dailyTotals[transaction.date] += amount;
    });

    const markedDates: Record<string, any> = {};

    Object.keys(dailyTotals).forEach(date => {
        const amount = dailyTotals[date];

        markedDates[date] = {
            customStyles: {
                container: {
                    backgroundColor: '#f0f0f0',
                    borderRadius: 8,
                    borderWidth: date === selectedDate ? 2 : 0,
                    borderColor: date === selectedDate ? '#3F51B5' : 'transparent',  
                },
                text: {
                    color: amount >= 0 ? 'green' : 'red',
                    fontWeight: 'bold',
                },
            },
            customText: `${amount >= 0 ? '+' : ''}${amount.toFixed(2)}`, 
        };
    });

    if (selectedDate && !markedDates[selectedDate]) {
        markedDates[selectedDate] = {
            customStyles: {
                container: {
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: '#3F51B5',
                },
                text: {
                    color: 'black',
                    fontWeight: 'bold',
                },
            },
        };
    }

    return markedDates;
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    summaryContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TransactionCalendar;
