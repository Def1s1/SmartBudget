import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { useTransactions } from './context/TransactionContext';
import { Transaction } from './storage';
import { GoalBlock } from './components/GoalBlock';
import { TransactionItem } from './components/TransactionItem';
import { Calendar, DateData } from 'react-native-calendars';

// Main screen
const IndexScreen = () => {
    const { transactions, removeTransaction } = useTransactions();
    
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const handleEditBudget = () => {
        Alert.alert('Edit Budget', 'Here you can open a modal to edit the budget.');
    };

    const handleDeleteTransaction = (id: string) => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => removeTransaction(id), style: "destructive" }
            ]
        );
    };

    const handleDayPress = (day: DateData) => {
        const { dateString } = day;
        setSelectedDate(dateString);

        const dailyTransactions = transactions.filter(t => t.date === dateString);
        const total = dailyTransactions.reduce((sum, t) => {
            return sum + (t.type === 'expense' ? -t.amount : t.amount);
        }, 0);

        setSelectedAmount(total);
    };

    const markedDates = getMarkedDates(transactions, selectedDate);

    return (
        <View style={styles.container}>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TransactionItem
                        transaction={item}
                        onDelete={handleDeleteTransaction}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet</Text>}
                ListHeaderComponent={
                    <View>
                        <GoalBlock />
                        
                        {/* New calendar with date selection support */}
                        <Calendar
                            markingType="custom"
                            markedDates={markedDates}
                            onDayPress={handleDayPress}
                        />

                        {/* Display the total for the selected date */}
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

                        <Text style={styles.sharesTitle}>Transactions</Text>
                    </View>
                }
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
};

// ===== Processing data for the calendar =====
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
                    borderColor: date === selectedDate ? '#3F51B5' : 'transparent', // Blue border
                },
                text: {
                    color: amount >= 0 ? 'green' : 'red',
                    fontWeight: 'bold',
                },
            },
            customText: `${amount >= 0 ? '+' : ''}${amount.toFixed(2)}`, // Display + or - amount
        };
    });

    // If a date is selected but there is no data, still highlight it
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

// ====== Styles ======
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 50,
    },
    sharesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
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

export default IndexScreen;
