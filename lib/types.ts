export type PlayerName = 'Bart' | 'Emile' | 'Age' | 'Harry' | 'Ronald';

export const PLAYERS: PlayerName[] = ['Bart', 'Emile', 'Age', 'Harry', 'Ronald'];

export type AvailabilityStatus = 'ja' | 'nee' | 'twijfel' | 'onbekend';

export interface MatchAvailability {
  [player: string]: AvailabilityStatus;
}

export interface MatchExtra {
  driver?: string;
  wash?: string;
  notes?: string;
}

export interface Match {
  id: string;
  date: string; // DD-MM-YYYY
  day: string;
  time: string;
  home: string;
  away: string;
  isHardenberg: boolean;
  isHome: boolean;
  location: string;
  address: string;
  googleMapsUrl: string;
  isMoved?: boolean;
}

export interface AvailabilityData {
  [matchId: string]: {
    players: MatchAvailability;
    extra?: MatchExtra;
  };
}

export interface Sporthal {
  name: string;
  teams: string[];
  address: string;
  city: string;
  mapsUrl: string;
  notes?: string;
}
