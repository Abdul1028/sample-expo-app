import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LaunchCard } from '@/components/LaunchCard';
import { SearchBar } from '@/components/SearchBar';
import { fetchUpcomingLaunches, searchLaunches } from '@/lib/api';
import type { Launch } from '@/lib/api';
import { SpaceTheme } from '@/constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isInitialMount = useRef(true);

  const loadLaunches = useCallback(async (query = '') => {
    try {
      setError(null);
      const data = query
        ? await searchLaunches(query)
        : await fetchUpcomingLaunches();
      setLaunches(data.results);
    } catch {
      setError('Failed to load launches. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadLaunches();
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      loadLaunches(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, loadLaunches]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSearchQuery('');
    loadLaunches();
  }, [loadLaunches]);

  if (loading && launches.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={SpaceTheme.accent} />
        <Text style={styles.loadingText}>Loading launches...</Text>
      </View>
    );
  }

  if (error && launches.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            loadLaunches();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>🚀 LaunchLens</Text>
        <Text style={styles.subtitle}>Upcoming Space Launches</Text>
      </View>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <FlatList
        data={launches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LaunchCard launch={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={SpaceTheme.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No launches found</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  loadingText: {
    color: SpaceTheme.textSecondary,
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: SpaceTheme.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  empty: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: SpaceTheme.textSecondary,
    fontSize: 16,
  },
});
