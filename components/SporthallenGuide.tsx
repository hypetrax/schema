'use client';

import React from 'react';
import { SPORTHALLEN } from '@/lib/data';
import { MapPin, Navigation, Info } from 'lucide-react';

export const SporthallenGuide: React.FC = () => {
  const halls = Object.entries(SPORTHALLEN);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.3rem' }}>
          📍 Sporthallen & Locaties
        </h2>
        <p style={{ color: 'var(--color-text-sub)', fontSize: '0.88rem' }}>
          Overzicht van alle sporthallen in de competitie met directe navigatielinks naar Google Maps.
        </p>
      </div>

      <div className="halls-grid">
        {halls.map(([teamKey, hall]) => (
          <div key={teamKey} className="glass-panel hall-card">
            <div className="hall-name">{hall.name}</div>
            <div className="hall-teams">Teambasis: {hall.teams.join(', ')}</div>
            <div className="hall-address">
              <MapPin size={14} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              <span>{hall.address}, {hall.city}</span>
            </div>

            {hall.notes && (
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '1rem', display: 'flex', gap: 6 }}>
                <Info size={14} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                <span>{hall.notes}</span>
              </div>
            )}

            <a
              href={hall.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn"
              style={{ width: '100%', justifyContent: 'center', background: 'rgba(2, 132, 199, 0.15)', borderColor: 'rgba(2, 132, 199, 0.3)', color: '#38bdf8' }}
            >
              <Navigation size={14} />
              <span>Navigeer via Google Maps</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
