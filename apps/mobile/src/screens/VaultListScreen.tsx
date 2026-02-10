import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles as themeStyles, PwTheme } from '../theme';
import { getVault, syncVaultWithCloud, lockVault } from '@pwmnger/app-logic';
import type { VaultEntry } from '@pwmnger/vault';

export default function VaultListScreen() {
  const navigation = useNavigation<any>();
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    try {
      const vault = getVault();
      setEntries(vault.entries || []);
    } catch (e) {
      // Vault locked or error
      navigation.replace('Login');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await syncVaultWithCloud();
      loadData();
    } catch (e) {
      console.warn("Sync failed", e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
      await lockVault();
      navigation.replace('Login');
  };

  const renderItem = ({ item }: { item: VaultEntry }) => (
    <View style={localStyles.item}>
      <View>
        <Text style={localStyles.site}>{item.site}</Text>
        <Text style={localStyles.username}>{item.username}</Text>
      </View>
      <Text style={localStyles.copy}>📋</Text>
    </View>
  );

  return (
    <View style={themeStyles.container}>
      <View style={localStyles.header}>
        <Text style={themeStyles.title}>My Vault</Text>
        <TouchableOpacity onPress={handleLogout}>
            <Text style={{color: PwTheme.colors.notification}}>Lock</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PwTheme.colors.primary} />
        }
        ListEmptyComponent={<Text style={themeStyles.subtitle}>No passwords saved yet.</Text>}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
  },
  item: {
    backgroundColor: PwTheme.colors.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PwTheme.colors.border,
  },
  site: {
    color: PwTheme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    color: '#94a3b8',
    fontSize: 14,
  },
  copy: {
      fontSize: 20
  }
});
