import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTransactions } from '../context/TransactionContext';

type GoalBlockProps = {
    onEdit?: () => void;  
};

const BUDGET_KEY = 'user_budget';

export const GoalBlock = ({ onEdit }: GoalBlockProps) => {
    const { transactions } = useTransactions();
    const [goalAmount, setGoalAmount] = useState<number>(1000000); 
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

   
    useEffect(() => {
        loadBudget();
    }, []);

    const loadBudget = async () => {
        const savedBudget = await AsyncStorage.getItem(BUDGET_KEY);
        if (savedBudget) {
            setGoalAmount(Number(savedBudget));
        }
    };

    const saveBudget = async () => {
        const newGoal = parseFloat(inputValue);
        if (isNaN(newGoal) || newGoal <= 0) {
            Alert.alert('Error', 'Please enter a valid budget amount');
            return;
        }

        setGoalAmount(newGoal);
        await AsyncStorage.setItem(BUDGET_KEY, newGoal.toString());
        setModalVisible(false);
    };

    
    const totalBudget = transactions.reduce((total, transaction) => {
        return transaction.type === 'income'
            ? total + transaction.amount
            : total - transaction.amount;
    }, 0);

    const progress = (totalBudget / goalAmount) * 100;

    return (
        <View>
            <Text style={styles.totalBudgetTitle}>Total Budget</Text>

            <View style={styles.budgetRow}>
                <Text style={styles.totalAmount}>${totalBudget.toLocaleString()}</Text>
                <Text style={styles.totalGoal}>/{goalAmount.toLocaleString()}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editIcon}>
                    <Ionicons name="pencil" size={20} color="#3F51B5" />
                </TouchableOpacity>
            </View>

            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>

            {}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Set New Goal Amount</Text>
                        <TextInput
                            placeholder="Enter goal amount"
                            style={styles.input}
                            keyboardType="numeric"
                            value={inputValue}
                            onChangeText={setInputValue}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveBudget}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    totalBudgetTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    budgetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3F51B5',
    },
    totalGoal: {
        fontSize: 16,
        color: '#888',
        marginLeft: 5,
    },
    editIcon: {
        marginLeft: 'auto',
        padding: 5,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3F51B5',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelText: {
        color: 'tomato',
        fontSize: 16,
    },
    saveText: {
        color: '#5A55FF',
        fontSize: 16,
    },
});
