import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export type Account = {
    id: string;
    name: string;
    balance: number;
    emoji?: string;  // added emoji support
};

export type Category = {
    id: string;
    name: string;
};

export type Transaction = {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    accountId?: string;
    date: string;
};

// Keys
const ACCOUNTS_KEY = 'user_accounts';
const INCOME_CATEGORIES_KEY = 'income_categories';
const EXPENSE_CATEGORIES_KEY = 'expense_categories';
const TRANSACTIONS_KEY = 'user_transactions';

// ===== Transaction Functions =====
export const getTransactions = async (): Promise<Transaction[]> => {
    try {
        const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading transactions:', error);
        return [];
    }
};

export const saveTransactions = async (transactions: Transaction[]) => {
    try {
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving transactions:', error);
    }
};

export const addTransactionToStorage = async (transaction: Transaction): Promise<Transaction[]> => {
    const transactions = await getTransactions();
    const updatedTransactions = [transaction, ...transactions];
    await saveTransactions(updatedTransactions);
    return updatedTransactions;
};

// ===== Account Functions =====
export const getAccounts = async (): Promise<Account[]> => {
    try {
        const data = await AsyncStorage.getItem(ACCOUNTS_KEY);
        const accounts: Account[] = data ? JSON.parse(data) : [];

        // Processing old accounts without emojis — add a default emoji
        return accounts.map(account => ({
            ...account,
            emoji: account.emoji || '💳',  // default emoji for old data
        }));
    } catch (error) {
        console.error('Error loading accounts:', error);
        return [];
    }
};

export const saveAccounts = async (accounts: Account[]) => {
    try {
        await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
        console.error('Error saving accounts:', error);
    }
};

// ===== Category Functions =====
export const getIncomeCategories = async (): Promise<Category[]> => {
    return loadCategories(INCOME_CATEGORIES_KEY);
};

export const getExpenseCategories = async (): Promise<Category[]> => {
    return loadCategories(EXPENSE_CATEGORIES_KEY);
};

export const saveIncomeCategories = async (categories: Category[]) => {
    await saveCategories(INCOME_CATEGORIES_KEY, categories);
};

export const saveExpenseCategories = async (categories: Category[]) => {
    await saveCategories(EXPENSE_CATEGORIES_KEY, categories);
};

// ===== Helper Functions for Categories =====
const loadCategories = async (key: string): Promise<Category[]> => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error loading categories with key ${key}:`, error);
        return [];
    }
};

const saveCategories = async (key: string, categories: Category[]) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(categories));
    } catch (error) {
        console.error(`Error saving categories with key ${key}:`, error);
    }
};

// ===== Initialize Default Categories =====
export const initDefaultCategories = async () => {
    const income = await getIncomeCategories();
    const expense = await getExpenseCategories();

    if (income.length === 0) {
        const defaultIncomeCategories: Category[] = [
            { id: 'salary', name: 'Salary' },
            { id: 'freelance', name: 'Freelance' },
        ];
        await saveIncomeCategories(defaultIncomeCategories);
    }

    if (expense.length === 0) {
        const defaultExpenseCategories: Category[] = [
            { id: 'food', name: 'Food' },
            { id: 'transport', name: 'Transport' },
        ];
        await saveExpenseCategories(defaultExpenseCategories);
    }
};

// ===== Clear All Data =====
export const clearAllData = async () => {
    try {
        await AsyncStorage.multiRemove([
            ACCOUNTS_KEY,
            INCOME_CATEGORIES_KEY,
            EXPENSE_CATEGORIES_KEY,
            TRANSACTIONS_KEY,
        ]);
        console.log('✅ All data successfully deleted');
    } catch (error) {
        console.error('Error clearing all data:', error);
    }
};
