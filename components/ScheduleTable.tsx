'use client';

import React, { useState } from 'react';
import { Match } from '@/lib/types';
import { Search, MapPin } from 'lucide-react';

interface ScheduleTableProps {
  matches: Match[];
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ matches }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('ALL');

  const filteredMatches = matches.filter(m => {
    const matchesSearch = 
      m.home.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.away.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.date.includes(searchTerm) ||
      m.day.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterTeam === 'HARDENBERG') {
      return matchesSearch && m.isHardenberg;
    }
    return matchesSearch;
  });

  return (
    <div>
      <div className="controls-bar">
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Zoek op team, datum, dag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            className={`filter-chip ${filterTeam === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterTeam('ALL')}
          >
            Alle Teams ({matches.length})
          </button>
          <button
            className={`filter-chip ${filterTeam === 'HARDENBERG' ? 'active' : ''}`}
            onClick={() => setFilterTeam('HARDENBERG')}
          >
            Alleen BV Hardenberg ({matches.filter(m => m.isHardenberg).length})
          </button>
        </div>
      </div>

      <div className="schedule-table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Dag</th>
              <th>Tijd</th>
              <th>Thuis Team</th>
              <th></th>
              <th>Uit Team</th>
              <th>Locatie / Sporthal</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.map(m => (
              <tr key={m.id} className={m.isHardenberg ? 'is-hb' : ''}>
                <td style={{ fontWeight: 600 }}>{m.date}</td>
                <td style={{ color: 'var(--color-text-sub)' }}>{m.day}</td>
                <td>{m.time}</td>
                <td style={{ fontWeight: m.home === 'BV Hardenberg' ? 800 : 500, color: m.home === 'BV Hardenberg' ? '#34d399' : 'inherit' }}>
                  {m.home}
                </td>
                <td style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>-</td>
                <td style={{ fontWeight: m.away === 'BV Hardenberg' ? 800 : 500, color: m.away === 'BV Hardenberg' ? '#34d399' : 'inherit' }}>
                  {m.away}
                </td>
                <td>
                  <a href={m.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="location-link" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} />
                    {m.location}
                  </a>
                </td>
              </tr>
            ))}

            {filteredMatches.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                  Geen wedstrijden gevonden voor deze zoekopdracht.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
