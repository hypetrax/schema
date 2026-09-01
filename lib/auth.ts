import { PlayerName } from './types';

export const PLAYER_PASSWORDS: Record<PlayerName, string> = {
  Bart: 'Bart-7834',
  Emile: 'Emile-2941',
  Age: 'Age-6158',
  Harry: 'Harry-4092',
  Ronald: 'Ronald-8315'
};

export function verifyCredentials(player: PlayerName, passwordInput: string): boolean {
  if (!player || !passwordInput) return false;
  const expected = PLAYER_PASSWORDS[player];
  if (!expected) return false;
  return expected.trim().toLowerCase() === passwordInput.trim().toLowerCase();
}
