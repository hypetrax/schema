'use client';

import React from 'react';
import { Match, AvailabilityData, PLAYERS, PlayerName } from '@/lib/types';
import { UserCheck, Users, Trophy, Percent, Sparkles } from 'lucide-react';

interface StatsLineupProps {
  matches: Match[];
  availabilityData: AvailabilityData;
}

export const StatsLineup: React.FC<StatsLineupProps> = ({ matches, availabilityData }) => {
  const hbMatches = matches.filter(m => m.isHardenberg);
  const totalHbMatches = hbMatches.length;

  const playerStats = PLAYERS.map(player => {
    let ja = 0;
    let nee = 0;
    let twijfel = 0;
    let onbekend = 0;

    hbMatches.forEach(m => {
      const st = availabilityData[m.id]?.players?.[player] || 'onbekend';
      if (st === 'ja') ja++;
      else if (st === 'nee') nee++;
      else if (st === 'twijfel') twijfel++;
      else onbekend++;
    });

    const percent = totalHbMatches > 0 ? Math.round((ja / totalHbMatches) * 100) : 0;

    return {
      name: player,
      ja,
      nee,
      twijfel,
      onbekend,
      percent
    };
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.3rem' }}>
          📊 Team Statistieken & Beschikbaarheid
        </h2>
        <p style={{ color: 'var(--color-text-sub)', fontSize: '0.88rem' }}>
          Overzicht van aantal gespeelde / toegezegde wedstrijden per speler van BV Hardenberg.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trophy size={16} style={{ color: '#f59e0b' }} />
            Totaal Wedstrijden BV Hardenberg
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginTop: '0.4rem' }}>
            {totalHbMatches} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>(7 thuis, 7 uit)</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={16} style={{ color: '#10b981' }} />
            Selectie Spelers
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', marginTop: '0.5rem' }}>
            Bart, Emile, Age, Harry, Ronald
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Spelers Overzicht</h3>

      <div className="schedule-table-wrapper" style={{ marginBottom: '2rem' }}>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Speler</th>
              <th>🟢 Aanwezig</th>
              <th>🟡 Twijfel</th>
              <th>🔴 Afwezig</th>
              <th>⚪ Nog invullen</th>
              <th>Aanwezigheid %</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map(stat => (
              <tr key={stat.name}>
                <td style={{ fontWeight: 700, color: 'white' }}>{stat.name}</td>
                <td style={{ color: '#34d399', fontWeight: 700 }}>{stat.ja}x</td>
                <td style={{ color: '#fbbf24' }}>{stat.twijfel}x</td>
                <td style={{ color: '#f87171' }}>{stat.nee}x</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{stat.onbekend}x</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${stat.percent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #0284c7)', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, width: 36 }}>{stat.percent}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
