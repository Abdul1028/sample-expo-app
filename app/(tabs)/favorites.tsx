import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LaunchCard } from '@/components/LaunchCard';
import { getFavorites } from '@/lib/storage';
import type { Launch } from '@/lib/api';
import { SpaceTheme } from '@/constants/theme';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState<Launch[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
    }, [])
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>⭐ Favorites</Text>
        <Text style={styles.subtitle}>Your saved launches</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LaunchCard launch={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Tap the star icon on a launch to save it here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SpaceTheme.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: SpaceTheme.text,
  },
  subtitle: {
    fontSize: 14,
    color: SpaceTheme.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  empty: {
    padding: 48,
    alignItems: 'center',
    marginTop: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: SpaceTheme.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: SpaceTheme.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
