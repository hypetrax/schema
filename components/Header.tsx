'use client';

import React from 'react';
import { PLAYERS, PlayerName } from '@/lib/types';
import { User, RefreshCw, LogIn, LogOut, Lock } from 'lucide-react';
import { SyncBar } from './SyncBar';

interface HeaderProps {
  activePlayer: PlayerName | null;
  redisActive: boolean;
  onOpenLogin: (player?: PlayerName) => void;
  onLogout: () => void;
  onRefreshSchema: () => void;
  onShowToast: (msg: string) => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activePlayer,
  redisActive,
  onOpenLogin,
  onLogout,
  onRefreshSchema,
  onShowToast,
  isRefreshing
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-group">
          <img
            src="/logonew.svg"
            alt="BV Hardenberg Logo"
            style={{
              height: '46px',
              width: 'auto',
              maxHeight: '46px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.4))'
            }}
          />
          <div>
            <div className="brand-title">BV Hardenberg</div>
            <div className="brand-subtitle">
              <span>Wedstrijdschema 2026-2027</span>
              <span className="domain-pill">schema.bartpullen.nl</span>
            </div>
          </div>
        </div>

        <div className="user-selector-bar">
          <SyncBar
            redisActive={redisActive}
            onShowToast={onShowToast}
          />

          {activePlayer ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4, paddingRight: 4, fontSize: '0.85rem' }}>
                <Lock size={14} style={{ color: '#34d399' }} />
                <span>Ingelogd als: <strong style={{ color: '#34d399' }}>{activePlayer}</strong></span>
              </div>
              <button
                className="player-btn"
                onClick={onLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}
              >
                <LogOut size={13} />
                Uitloggen
              </button>
            </>
          ) : (
            <>
              <span className="user-selector-label">
                <User size={14} style={{ display: 'inline', marginRight: 4 }} />
                Inloggen:
              </span>
              {PLAYERS.map(player => (
                <button
                  key={player}
                  className="player-btn"
                  onClick={() => onOpenLogin(player)}
                >
                  {player}
                </button>
              ))}
              <button
                className="player-btn active"
                onClick={() => onOpenLogin()}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <LogIn size={13} />
                Inloggen
              </button>
            </>
          )}

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
