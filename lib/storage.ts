import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Launch } from './api';

const FAVORITES_KEY = 'launchlens_favorites';

export async function getFavorites(): Promise<Launch[]> {
  const data = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export async function addFavorite(launch: Launch): Promise<void> {
  const favorites = await getFavorites();
  if (favorites.some((f) => f.id === launch.id)) return;
  favorites.push(launch);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export async function removeFavorite(id: string): Promise<void> {
  const favorites = await getFavorites();
  const updated = favorites.filter((f) => f.id !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function isFavorite(id: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((f) => f.id === id);
}
