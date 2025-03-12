import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput, Modal, ScrollView } from 'react-native';
import { getAccounts, saveAccounts, Account } from './storage';
import { Ionicons } from '@expo/vector-icons';


const emojiList = ['💳', '💰', '🏦', '🚀', '🍕', '✈️', '🏠', '🎁', '📈', '🛍️'];

export default function WalletScreen() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountEmoji, setNewAccountEmoji] = useState('💳');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        const storedAccounts = await getAccounts();
        if (storedAccounts.length === 0) {
            const defaultAccounts: Account[] = [
                { id: 'card', name: 'Card', balance: 0, emoji: '💳' },
                { id: 'cash', name: 'Cash', balance: 0, emoji: '💰' },
                { id: 'savings', name: 'Savings', balance: 0, emoji: '🏦' },
            ];
            setAccounts(defaultAccounts);
            await saveAccounts(defaultAccounts);
        } else {
            setAccounts(storedAccounts);
        }
    };

    const addNewAccount = async () => {
        if (!newAccountName.trim()) {
            Alert.alert('Error', 'Account name cannot be empty');
            return;
        }

        const newAccount: Account = {
            id: Date.now().toString(),
            name: newAccountName,
            balance: 0,
            emoji: newAccountEmoji,
        };

        const updatedAccounts = [...accounts, newAccount];
        setAccounts(updatedAccounts);
        await saveAccounts(updatedAccounts);

        setNewAccountName('');
        setNewAccountEmoji('💳');
        setModalVisible(false);
    };

    const deleteAccount = (id: string) => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete this account?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const updatedAccounts = accounts.filter(account => account.id !== id);
                        setAccounts(updatedAccounts);
                        await saveAccounts(updatedAccounts);
                    }
                }
            ]
        );
    };

    const openDetailsModal = (account: Account) => {
        setSelectedAccount(account);
        setDetailsModalVisible(true);
    };

    const updateSelectedAccountEmoji = async (emoji: string) => {
        if (selectedAccount) {
            const updatedAccount = { ...selectedAccount, emoji };
            const updatedAccounts = accounts.map(acc =>
                acc.id === updatedAccount.id ? updatedAccount : acc
            );
            setAccounts(updatedAccounts);
            await saveAccounts(updatedAccounts);
            setSelectedAccount(updatedAccount);
        }
    };

    const renderAccount = ({ item }: { item: Account }) => (
        <TouchableOpacity onPress={() => openDetailsModal(item)} style={styles.accountItem}>
            <View style={styles.accountInfo}>
                <Text style={styles.accountEmoji}>{item.emoji}</Text>
                <Text style={styles.accountName}>{item.name}</Text>
            </View>
            <View style={styles.accountActions}>
                <Text style={styles.accountBalance}>${item.balance.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => deleteAccount(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Accounts</Text>

            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                renderItem={renderAccount}
                ListFooterComponent={
                    <TouchableOpacity style={styles.addAccountButton} onPress={() => setModalVisible(true)}>
                        <Ionicons name="add-circle-outline" size={24} color="#5A55FF" />
                        <Text style={styles.addAccountText}>Add New Account</Text>
                    </TouchableOpacity>
                }
            />

            {/* Модалка для создания аккаунта */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>New Account</Text>
                        <TextInput
                            placeholder="Account Name"
                            style={styles.input}
                            value={newAccountName}
                            onChangeText={setNewAccountName}
                        />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {emojiList.map((emoji) => (
                                <TouchableOpacity
                                    key={emoji}
                                    onPress={() => setNewAccountEmoji(emoji)}
                                    style={[
                                        styles.emojiSelector,
                                        newAccountEmoji === emoji && styles.selectedEmoji,
                                    ]}
                                >
                                    <Text style={styles.emoji}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addNewAccount}>
                                <Text style={styles.addText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Модалка деталей аккаунта */}
            <Modal visible={detailsModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedAccount?.name}</Text>
                        <Text style={styles.accountBalance}>Balance: ${selectedAccount?.balance.toFixed(2)}</Text>
                        <Text style={styles.label}>Select Emoji:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {emojiList.map((emoji) => (
                                <TouchableOpacity
                                    key={emoji}
                                    onPress={() => updateSelectedAccountEmoji(emoji)}
                                    style={[
                                        styles.emojiSelector,
                                        selectedAccount?.emoji === emoji && styles.selectedEmoji,
                                    ]}
                                >
                                    <Text style={styles.emoji}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F9F9F9' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    accountItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 8, backgroundColor: '#fff', marginBottom: 10 },
    accountInfo: { flexDirection: 'row', alignItems: 'center' },
    accountEmoji: { fontSize: 24, marginRight: 10 },
    accountName: { fontSize: 16, fontWeight: 'bold' },
    accountActions: { flexDirection: 'row', alignItems: 'center' },
    accountBalance: { fontSize: 16 },
    addAccountButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    addAccountText: { marginLeft: 8, color: '#5A55FF' },
    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
    emojiSelector: { padding: 10 },
    selectedEmoji: { backgroundColor: '#ddd', borderRadius: 10 },
    emoji: { fontSize: 24 },
    modalTitle: { fontWeight: 'bold', fontSize: 18 },
    input: { borderWidth: 1, padding: 10, marginVertical: 10 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
    cancelText: { color: 'red' },
    addText: { color: 'green' },
    label: { fontWeight: 'bold', marginVertical: 10 },
    closeButton: { marginTop: 20 },
    closeButtonText: { color: '#007AFF' },
});
