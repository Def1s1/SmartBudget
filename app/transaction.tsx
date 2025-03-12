import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar, DateData } from 'react-native-calendars';
import { useTransactions } from './context/TransactionContext';
import uuid from 'react-native-uuid';

type Transaction = {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: string;
    account: string;
};

export default function AddTransactionScreen() {
    const { addTransaction } = useTransactions();

    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [showCalendar, setShowCalendar] = useState(false);

    const handleAddTransaction = async () => {
        if (!amount || !selectedCategory || !selectedAccount) {
            Alert.alert('Error', 'Please enter amount, select a category, and choose an account');
            return;
        }

        const newTransaction: Transaction = {
            id: uuid.v4() as string,
            type,
            amount: parseFloat(amount),
            category: selectedCategory,
            date,
            account: selectedAccount,
        };

        try {
            await addTransaction(newTransaction);
            Alert.alert('Success', 'Transaction added successfully!');
            resetForm();
        } catch (error) {
            Alert.alert('Error', 'Failed to add transaction');
            console.error('❌ Failed to add transaction:', error);
        }
    };

    const resetForm = () => {
        setAmount('');
        setSelectedCategory('');
        setSelectedAccount('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add Transaction</Text>

            <View style={styles.typeSwitch}>
                <TouchableOpacity
                    style={[styles.typeButton, type === 'expense' && styles.activeExpense]}
                    onPress={() => setType('expense')}
                >
                    <Text style={styles.typeButtonText}>Expense</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.typeButton, type === 'income' && styles.activeIncome]}
                    onPress={() => setType('income')}
                >
                    <Text style={styles.typeButtonText}>Income</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>{date}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Category" value="" />
                    <Picker.Item label="Food" value="Food" />
                    <Picker.Item label="Transport" value="Transport" />
                    <Picker.Item label="Salary" value="Salary" />
                </Picker>
            </View>

            <Text style={styles.label}>Account</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedAccount}
                    onValueChange={(itemValue) => setSelectedAccount(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Account" value="" />
                    <Picker.Item label="Cash" value="Cash" />
                    <Picker.Item label="Bank Account" value="Bank Account" />
                    <Picker.Item label="Credit Card" value="Credit Card" />
                </Picker>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
                <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>

            <Modal visible={showCalendar} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Calendar
                            current={date}
                            onDayPress={(day: DateData) => {
                                setDate(day.dateString);
                                setShowCalendar(false);
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowCalendar(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    typeSwitch: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    typeButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginHorizontal: 10,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
    },
    activeExpense: {
        backgroundColor: 'tomato',
    },
    activeIncome: {
        backgroundColor: 'green',
    },
    typeButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontWeight: '500',
    },
    dateButton: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '90%',
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
