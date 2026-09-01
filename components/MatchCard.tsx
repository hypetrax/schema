'use client';

import React, { useState } from 'react';
import { Match, MatchAvailability, MatchExtra, PLAYERS, PlayerName, AvailabilityStatus } from '@/lib/types';
import { generateICalContent, generateWhatsAppMessage } from '@/lib/data';
import { Calendar, Clock, MapPin, Share2, Download, Car, Shirt, MessageSquare, Check, X, HelpCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  activePlayer: PlayerName | null;
  availability: MatchAvailability;
  extra?: MatchExtra;
  onUpdateStatus: (matchId: string, player: PlayerName, status: AvailabilityStatus) => void;
  onUpdateExtra: (matchId: string, extraData: Partial<MatchExtra>) => void;
  onOpenLogin: (player: PlayerName) => void;
  onShowToast: (msg: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  activePlayer,
  availability,
  extra,
  onUpdateStatus,
  onUpdateExtra,
  onOpenLogin,
  onShowToast
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const jaCount = PLAYERS.filter(p => availability[p] === 'ja').length;

  const handleStatusClick = (player: PlayerName, status: AvailabilityStatus) => {
    if (!activePlayer) {
      onOpenLogin(player);
      return;
    }

    if (activePlayer !== player) {
      onShowToast(`🔒 Je bent ingelogd als ${activePlayer}. Je kunt alleen je eigen aanwezigheid wijzigen.`);
      return;
    }

    onUpdateStatus(match.id, player, status);
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppMessage(match, availability, extra);
    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      navigator.share({
        title: `BV Hardenberg vs ${match.away}`,
        text: text
      }).catch(() => {
        navigator.clipboard.writeText(text);
        onShowToast('WhatsApp bericht gekopieerd naar klembord!');
      });
    } else {
      navigator.clipboard.writeText(text);
      onShowToast('WhatsApp bericht gekopieerd naar klembord!');
    }
  };

  const handleDownloadICS = () => {
    const icsData = generateICalContent(match);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `badminton-${match.date}-${match.home}-vs-${match.away}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Agenda afspraak (.ics) gedownload!');
  };

  return (
    <div className={`glass-panel match-card ${match.isHardenberg ? 'glass-card-hardenberg' : ''}`}>
      <div className="match-card-header">
        <div className="match-date-badge">
          <Calendar size={14} />
          <span>{match.day} {match.date}</span>
          <span style={{ color: 'var(--color-text-muted)', marginLeft: 4 }}>
            <Clock size={12} style={{ display: 'inline', marginRight: 2 }} />
            {match.time}
          </span>
        </div>
        <span className={`home-away-pill ${match.isHome ? 'pill-thuis' : 'pill-uit'}`}>
          {match.isHome ? 'Thuis' : 'Uit'}
        </span>
      </div>

      <div className="match-teams-title">
        {match.isHome ? (
          <>
            <span className="team-highlight">BV Hardenberg</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>vs</span>
            <span>{match.away}</span>
          </>
        ) : (
          <>
            <span>{match.home}</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>vs</span>
            <span className="team-highlight">BV Hardenberg</span>
          </>
        )}
      </div>

      <div className="location-info">
        <MapPin size={13} style={{ flexShrink: 0 }} />
        <a href={match.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="location-link" title="Open in Google Maps">
          {match.location}
        </a>
      </div>

      <div className="player-list-section">
        {PLAYERS.map(player => {
          const status = availability[player] || 'onbekend';
          const isCurrent = activePlayer === player;
          const isEditable = activePlayer === player;

          return (
            <div key={player} className="player-row" style={{ opacity: activePlayer && !isEditable ? 0.75 : 1 }}>
              <span className={`player-name-label ${isCurrent ? 'current-user' : ''}`}>
                {player}
                {isCurrent && <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700 }}>(jij)</span>}
                {activePlayer && !isEditable && <Lock size={11} style={{ color: 'var(--color-text-muted)', marginLeft: 2 }} />}
              </span>
              <div className="status-button-group">
                <button
                  className={`status-toggle-btn btn-ja ${status === 'ja' ? 'active' : ''}`}
                  onClick={() => handleStatusClick(player, 'ja')}
                  title={isEditable ? `${player} is aanwezig` : `Log in als ${player} om status te wijzigen`}
                  style={{ cursor: isEditable || !activePlayer ? 'pointer' : 'not-allowed' }}
                >
                  <Check size={14} />
                </button>
                <button
                  className={`status-toggle-btn btn-twijfel ${status === 'twijfel' ? 'active' : ''}`}
                  onClick={() => handleStatusClick(player, 'twijfel')}
                  title={isEditable ? `${player} twijfelt` : `Log in als ${player} om status te wijzigen`}
                  style={{ cursor: isEditable || !activePlayer ? 'pointer' : 'not-allowed' }}
                >
                  <HelpCircle size={14} />
                </button>
                <button
                  className={`status-toggle-btn btn-nee ${status === 'nee' ? 'active' : ''}`}
                  onClick={() => handleStatusClick(player, 'nee')}
                  title={isEditable ? `${player} is afwezig` : `Log in als ${player} om status te wijzigen`}
                  style={{ cursor: isEditable || !activePlayer ? 'pointer' : 'not-allowed' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}

        <div className="roster-summary-bar">
          <div className={`roster-count ${jaCount >= 4 ? 'roster-sufficient' : 'roster-warning'}`}>
            <span>Aanwezig: {jaCount}/5</span>
            {jaCount >= 4 ? ' (Opstelling compleet)' : ` (Nog ${4 - jaCount} nodig)`}
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-sub)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showDetails ? 'Minder' : 'Details & Vervoer'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="extra-details-box">
          <div className="form-group">
            <label><Car size={12} style={{ display: 'inline', marginRight: 4 }} />Wie rijdt er?</label>
            <select
              className="form-select"
              value={extra?.driver || ''}
              onChange={(e) => onUpdateExtra(match.id, { driver: e.target.value })}
            >
              <option value="">-- Nog niet bepaald --</option>
              {PLAYERS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="Eigen vervoer">Eigen vervoer / Ieder voor zich</option>
            </select>
          </div>

          <div className="form-group">
            <label><Shirt size={12} style={{ display: 'inline', marginRight: 4 }} />Wie wast de kleding / regelt het eten?</label>
            <select
              className="form-select"
              value={extra?.wash || ''}
              onChange={(e) => onUpdateExtra(match.id, { wash: e.target.value })}
            >
              <option value="">-- Geen / Onbekend --</option>
              {PLAYERS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label><MessageSquare size={12} style={{ display: 'inline', marginRight: 4 }} />Opmerking / Afspreektijd</label>
            <input
              type="text"
              className="form-input"
              placeholder="Bijv. Verzamelen 18:45 bij sporthal..."
              value={extra?.notes || ''}
              onChange={(e) => onUpdateExtra(match.id, { notes: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="match-card-actions">
        <button className="action-btn action-btn-whatsapp" onClick={handleShareWhatsApp}>
          <Share2 size={13} />
          <span>WhatsApp</span>
        </button>
        <button className="action-btn" onClick={handleDownloadICS}>
          <Download size={13} />
          <span>Agenda (.ics)</span>
        </button>
      </div>
    </div>
  );
};
