import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';

import { fetchLaunchById } from '@/lib/api';
import { addFavorite, removeFavorite, isFavorite } from '@/lib/storage';
import type { Launch } from '@/lib/api';
import { SpaceTheme } from '@/constants/theme';

function getStatusColor(abbrev: string): string {
  switch (abbrev) {
    case 'Go':
    case 'Success':
      return '#22C55E';
    case 'TBD':
    case 'TBC':
      return '#F59E0B';
    default:
      return '#94A3B8';
  }
}

export default function LaunchDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);

  const loadLaunch = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      setLoading(true);
      const data = await fetchLaunchById(id);
      setLaunch(data);
      const fav = await isFavorite(id);
      setFavorited(fav);
    } catch {
      setError('Failed to load launch details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadLaunch();
  }, [loadLaunch]);

  const toggleFavorite = async () => {
    if (!launch) return;
    if (favorited) {
      await removeFavorite(launch.id);
      setFavorited(false);
    } else {
      await addFavorite(launch);
      setFavorited(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={SpaceTheme.accent} />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (error || !launch) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Launch not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadLaunch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {launch.image && (
        <Image
          source={{ uri: launch.image }}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
        />
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.missionName}>
            {launch.mission?.name ?? launch.name}
          </Text>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favButton}>
            <Text style={styles.favIcon}>{favorited ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  getStatusColor(launch.status.abbrev) + '22',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(launch.status.abbrev) },
              ]}
            >
              {launch.status.name}
            </Text>
          </View>
          <Text style={styles.date}>
            {new Date(launch.net).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {launch.mission?.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mission</Text>
            <Text style={styles.description}>
              {launch.mission.description}
            </Text>
            {launch.mission.type && (
              <Text style={styles.meta}>Type: {launch.mission.type}</Text>
            )}
            {launch.mission.orbit && (
              <Text style={styles.meta}>
                Orbit: {launch.mission.orbit.name}
              </Text>
            )}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rocket</Text>
          <Text style={styles.infoValue}>
            {launch.rocket.configuration.full_name}
          </Text>
          {launch.rocket.configuration.description ? (
            <Text style={styles.description}>
              {launch.rocket.configuration.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Launch Provider</Text>
          <Text style={styles.infoValue}>
            {launch.launch_service_provider.name}
          </Text>
          {launch.launch_service_provider.description ? (
            <Text style={styles.description} numberOfLines={6}>
              {launch.launch_service_provider.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Launch Pad</Text>
          <Text style={styles.infoValue}>{launch.pad.name}</Text>
          <Text style={styles.meta}>{launch.pad.location.name}</Text>
        </View>

        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>Links</Text>
          <View style={styles.linksRow}>
            {launch.rocket.configuration.wiki_url && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() =>
                  Linking.openURL(launch.rocket.configuration.wiki_url!)
                }
              >
                <Text style={styles.linkText}>📖 Wikipedia</Text>
              </TouchableOpacity>
            )}
            {launch.pad.wiki_url && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => Linking.openURL(launch.pad.wiki_url!)}
              >
                <Text style={styles.linkText}>📍 Launch Pad</Text>
              </TouchableOpacity>
            )}
            {launch.vidURLs && launch.vidURLs.length > 0 && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => Linking.openURL(launch.vidURLs![0].url)}
              >
                <Text style={styles.linkText}>▶️ Webcast</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ height: 48 }} />
      </View>
    </ScrollView>
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
  heroImage: {
    width: '100%',
    height: 260,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  missionName: {
    fontSize: 24,
    fontWeight: '800',
    color: SpaceTheme.text,
    flex: 1,
  },
  favButton: {
    padding: 8,
  },
  favIcon: {
    fontSize: 28,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: SpaceTheme.textSecondary,
  },
  section: {
    marginTop: 24,
    backgroundColor: SpaceTheme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: SpaceTheme.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: SpaceTheme.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '600',
    color: SpaceTheme.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: SpaceTheme.textSecondary,
    lineHeight: 22,
    marginTop: 4,
  },
  meta: {
    fontSize: 13,
    color: SpaceTheme.textMuted,
    marginTop: 4,
  },
  linksSection: {
    marginTop: 24,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  linkButton: {
    backgroundColor: SpaceTheme.card,
    borderWidth: 1,
    borderColor: SpaceTheme.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  linkText: {
    color: SpaceTheme.accent,
    fontWeight: '600',
    fontSize: 14,
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
});
