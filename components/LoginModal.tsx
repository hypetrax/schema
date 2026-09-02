'use client';

import React, { useState } from 'react';
import { PLAYERS, PlayerName } from '@/lib/types';
import { verifyCredentials } from '@/lib/auth';
import { KeyRound, Lock, User, X, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (player: PlayerName, pass: string) => void;
  initialPlayer?: PlayerName | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialPlayer
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerName>(initialPlayer || 'Bart');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verifyCredentials(selectedPlayer, password)) {
      onLoginSuccess(selectedPlayer, password);
      setPassword('');
      onClose();
    } else {
      setError(`Wachtwoord voor ${selectedPlayer} is onjuist. Bekijk inlog.md voor je wachtwoord.`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: 420,
        width: '100%',
        padding: '1.75rem',
        position: 'relative',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
          <img src="/logonew.svg" alt="BV Hardenberg" style={{ height: '40px', width: 'auto' }} />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Speler Inloggen</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)' }}>
              Log in om je eigen aanwezigheid te beheren
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={13} style={{ display: 'inline', marginRight: 4 }} />Selecteer jou naam:</label>
            <select
              className="form-select"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value as PlayerName)}
              style={{ fontSize: '0.9rem', padding: '0.6rem' }}
            >
              {PLAYERS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginTop: '0.8rem' }}>
            <label><KeyRound size={13} style={{ display: 'inline', marginRight: 4 }} />Wachtwoord:</label>
            <input
              type="password"
              className="form-input"
              placeholder={`Vul wachtwoord voor ${selectedPlayer} in...`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize: '0.9rem', padding: '0.6rem' }}
              autoFocus
            />
          </div>

          {error && (
            <div style={{
              fontSize: '0.8rem',
              color: '#f87171',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.6rem 0.8rem',
              borderRadius: 8,
              marginTop: '0.8rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.6rem' }}>
            <button
              type="submit"
              className="player-btn active"
              style={{ flex: 1, padding: '0.65rem', fontSize: '0.9rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <CheckCircle2 size={16} />
              Inloggen als {selectedPlayer}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
