import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import type { Launch } from '@/lib/api';

function getStatusColor(abbrev: string): string {
  switch (abbrev) {
    case 'Go':
      return '#22C55E';
    case 'Success':
      return '#22C55E';
    case 'TBD':
      return '#F59E0B';
    case 'TBC':
      return '#F59E0B';
    default:
      return '#94A3B8';
  }
}

function getCountdown(dateStr: string): string {
  const now = new Date().getTime();
  const launch = new Date(dateStr).getTime();
  const diff = launch - now;
  if (diff <= 0) return 'Launched';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `T-${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `T-${hours}h ${minutes}m`;
  return `T-${minutes}m`;
}

interface LaunchCardProps {
  launch: Launch;
}

export function LaunchCard({ launch }: LaunchCardProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(getCountdown(launch.net));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(launch.net));
    }, 60000);
    return () => clearInterval(interval);
  }, [launch.net]);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/details/${launch.id}`)}
    >
      {launch.image && (
        <Image
          source={{ uri: launch.image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.missionName} numberOfLines={2}>
              {launch.mission?.name ?? launch.name}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(launch.status.abbrev) + '22' },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(launch.status.abbrev) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(launch.status.abbrev) },
                ]}
              >
                {launch.status.abbrev}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.rocketName}>
          🚀 {launch.rocket.configuration.name}
        </Text>
        <Text style={styles.provider}>
          🏢 {launch.launch_service_provider.name}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.date}>
            📅 {new Date(launch.net).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#141926',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E2636',
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  missionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rocketName: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 4,
  },
  provider: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E2636',
    paddingTop: 12,
  },
  date: {
    fontSize: 12,
    color: '#718096',
  },
  countdown: {
    fontSize: 14,
    fontWeight: '700',
    color: '#818CF8',
  },
});
