import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, ScrollView } from 'react-native';
import { Category, getIncomeCategories, getExpenseCategories, saveIncomeCategories, saveExpenseCategories } from './storage';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

export default function StatsScreen() {
    const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState<'income' | 'expense'>('income');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const income = await getIncomeCategories();
        const expense = await getExpenseCategories();

        setIncomeCategories(income);
        setExpenseCategories(expense);
    };

    const addCategory = async () => {
        if (!newCategoryName.trim()) {
            Alert.alert('Error', 'Category name cannot be empty');
            return;
        }

        const newCategory: Category = {
            id: uuid.v4().toString(),
            name: newCategoryName,
        };

        if (categoryType === 'income') {
            const updatedCategories = [...incomeCategories, newCategory];
            setIncomeCategories(updatedCategories);
            await saveIncomeCategories(updatedCategories);
        } else {
            const updatedCategories = [...expenseCategories, newCategory];
            setExpenseCategories(updatedCategories);
            await saveExpenseCategories(updatedCategories);
        }

        setNewCategoryName('');
        setModalVisible(false);
    };

    const deleteCategory = async (id: string, type: 'income' | 'expense') => {
        const confirm = await new Promise((resolve) => {
            Alert.alert(
                "Delete Category",
                "Are you sure you want to delete this category?",
                [
                    { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                    { text: "Delete", style: "destructive", onPress: () => resolve(true) }
                ]
            );
        });

        if (!confirm) return;

        if (type === 'income') {
            const updated = incomeCategories.filter(cat => cat.id !== id);
            setIncomeCategories(updated);
            await saveIncomeCategories(updated);
        } else {
            const updated = expenseCategories.filter(cat => cat.id !== id);
            setExpenseCategories(updated);
            await saveExpenseCategories(updated);
        }
    };

    const renderCategory = (type: 'income' | 'expense') => ({ item }: { item: Category }) => (
        <View style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteCategory(item.id, type)}>
                <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

    const showAddCategoryModal = (type: 'income' | 'expense') => {
        setCategoryType(type);
        setModalVisible(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.header}>Income Categories</Text>
            <FlatList
                data={incomeCategories}
                keyExtractor={(item) => item.id}
                renderItem={renderCategory('income')}
                scrollEnabled={false} // important to prevent conflicts with ScrollView
            />

            <Text style={styles.header}>Expense Categories</Text>
            <FlatList
                data={expenseCategories}
                keyExtractor={(item) => item.id}
                renderItem={renderCategory('expense')}
                scrollEnabled={false}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => showAddCategoryModal('income')}
            >
                <Ionicons name="add-circle-outline" size={24} color="#5A55FF" />
                <Text style={styles.addButtonText}>Add Income Category</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => showAddCategoryModal('expense')}
            >
                <Ionicons name="add-circle-outline" size={24} color="#5A55FF" />
                <Text style={styles.addButtonText}>Add Expense Category</Text>
            </TouchableOpacity>

            {/* Modal for adding a category */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>New {categoryType} Category</Text>
                        <TextInput
                            placeholder="Category Name"
                            style={styles.input}
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addCategory}>
                                <Text style={styles.addText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    categoryItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },
    categoryText: {
        fontSize: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    addButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#5A55FF',
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
    addText: {
        color: '#5A55FF',
        fontSize: 16,
    },
});
