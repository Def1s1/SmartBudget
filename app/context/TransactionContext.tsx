import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction, getTransactions, saveTransactions } from '../storage';

type TransactionContextType = {
    transactions: Transaction[];
    addTransaction: (transaction: Transaction) => Promise<void>;
    removeTransaction: (id: string) => Promise<void>;
    loadTransactions: () => Promise<void>;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    
    const loadTransactions = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Failed to load transactions:', error);
        }
    };

   
    const addTransaction = async (transaction: Transaction) => {
        try {
            const updatedTransactions = [transaction, ...transactions];
            setTransactions(updatedTransactions);
            await saveTransactions(updatedTransactions);
        } catch (error) {
            console.error('Failed to add transaction:', error);
        }
    };

    
    const removeTransaction = async (id: string) => {
        try {
            const updatedTransactions = transactions.filter(t => t.id !== id);
            setTransactions(updatedTransactions);
            await saveTransactions(updatedTransactions);
        } catch (error) {
            console.error('Failed to remove transaction:', error);
        }
    };

    
    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <TransactionContext.Provider value={{
            transactions,
            addTransaction,
            removeTransaction,
            loadTransactions
        }}>
            {children}
        </TransactionContext.Provider>
    );
};


export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
