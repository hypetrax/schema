'use client';

import React from 'react';
import { PLAYERS, PlayerName } from '@/lib/types';
import { User, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activePlayer: PlayerName | null;
  setActivePlayer: (player: PlayerName | null) => void;
  onRefreshSchema: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activePlayer,
  setActivePlayer,
  onRefreshSchema,
  isRefreshing
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-group">
          <div className="shuttle-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <div className="brand-title">BV Hardenberg</div>
            <div className="brand-subtitle">
              <span>Wedstrijdschema 2026-2027</span>
              <span className="domain-pill">schema.bartpullen.nl</span>
            </div>
          </div>
        </div>

        <div className="user-selector-bar">
          <span className="user-selector-label">
            <User size={14} style={{ display: 'inline', marginRight: 4 }} />
            Wie ben jij?
          </span>
          {PLAYERS.map(player => (
            <button
              key={player}
              className={`player-btn ${activePlayer === player ? 'active' : ''}`}
              onClick={() => setActivePlayer(activePlayer === player ? null : player)}
            >
              {player}
            </button>
          ))}

          <button 
            className="player-btn"
            onClick={onRefreshSchema}
            disabled={isRefreshing}
            title="Systeemschema vernieuwen van motia.nl"
            style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
};
