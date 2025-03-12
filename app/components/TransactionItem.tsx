import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../storage';

type TransactionItemProps = {
    transaction: Transaction;
    onDelete: (id: string) => void;  
};

export const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
    const isIncome = transaction.type === 'income';
    const formattedAmount = `${isIncome ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}`;

    return (
        <View style={styles.shareCard}>
            <View>
                <Text style={styles.shareName}>{transaction.category}</Text>
                <Text style={[styles.shareAmount, isIncome ? styles.income : styles.expense]}>
                    {formattedAmount}
                </Text>
            </View>

            {/* Кнопка удаления */}
            <TouchableOpacity onPress={() => onDelete(transaction.id)}>
                <Ionicons name="trash" size={24} color="tomato" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    shareCard: {
        backgroundColor: '#F7F7F7',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shareName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    shareAmount: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 5,
    },
    income: {
        color: 'green',
    },
    expense: {
        color: 'red',
    },
});
