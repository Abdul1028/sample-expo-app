const BASE_URL = 'https://ll.thespacedevs.com/2.2.0';

export interface LaunchStatus {
  id: number;
  name: string;
  abbrev: string;
  description: string;
}

export interface Agency {
  id: number;
  name: string;
  type: string;
  country_code: string;
  abbrev: string;
  description: string;
  info_url: string | null;
  wiki_url: string | null;
  logo_url: string | null;
  image_url: string | null;
}

export interface RocketConfiguration {
  id: number;
  name: string;
  full_name: string;
  description: string;
  family: string;
  variant: string;
  image_url: string | null;
  info_url: string | null;
  wiki_url: string | null;
}

export interface Rocket {
  id: number;
  configuration: RocketConfiguration;
}

export interface Pad {
  id: number;
  name: string;
  location: {
    id: number;
    name: string;
    country_code: string;
  };
  wiki_url: string | null;
  map_url: string | null;
  latitude: string;
  longitude: string;
}

export interface Mission {
  id: number;
  name: string;
  description: string;
  type: string;
  orbit: {
    id: number;
    name: string;
    abbrev: string;
  } | null;
}

export interface Launch {
  id: string;
  name: string;
  status: LaunchStatus;
  net: string;
  window_start: string;
  window_end: string;
  image: string | null;
  launch_service_provider: Agency;
  rocket: Rocket;
  mission: Mission | null;
  pad: Pad;
  vidURLs?: { url: string; title: string }[];
  webcast_live: boolean;
  program: {
    id: number;
    name: string;
    wiki_url: string | null;
  }[];
}

export interface LaunchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Launch[];
}

export async function fetchUpcomingLaunches(
  limit = 15,
  offset = 0
): Promise<LaunchResponse> {
  const url = `${BASE_URL}/launch/upcoming/?limit=${limit}&offset=${offset}&mode=detailed`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
}

export async function fetchLaunchById(id: string): Promise<Launch> {
  const url = `${BASE_URL}/launch/${id}/?mode=detailed`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
}

export async function searchLaunches(
  query: string,
  limit = 15
): Promise<LaunchResponse> {
  const url = `${BASE_URL}/launch/upcoming/?search=${encodeURIComponent(query)}&limit=${limit}&mode=detailed`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
}
