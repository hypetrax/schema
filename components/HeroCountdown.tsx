'use client';

import React, { useState, useEffect } from 'react';
import { Match, AvailabilityData, PLAYERS } from '@/lib/types';
import { parseDate } from '@/lib/data';
import { Calendar, Clock, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HeroCountdownProps {
  nextMatch: Match | null;
  availabilityData: AvailabilityData;
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({ nextMatch, availabilityData }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!nextMatch) return;

    const matchDate = parseDate(nextMatch.date, nextMatch.time);

    const updateTimer = () => {
      const now = new Date();
      const diff = matchDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextMatch]);

  if (!nextMatch) {
    return (
      <div className="hero-banner">
        <div>
          <span className="hero-tag">Geen aanstaande wedstrijden</span>
          <h2 className="hero-match-title">Alle wedstrijden voor dit seizoen zijn gespeeld!</h2>
        </div>
      </div>
    );
  }

  const matchAvail = availabilityData[nextMatch.id]?.players || {};
  const jaCount = PLAYERS.filter(p => matchAvail[p] === 'ja').length;

  return (
    <div className="hero-banner">
      <div className="next-match-info">
        <span className="hero-tag">
          <Calendar size={13} /> Eerstvolgende Wedstrijd ({nextMatch.isHome ? 'Thuis' : 'Uit'})
        </span>
        <h2 className="hero-match-title">
          {nextMatch.isHome ? (
            <>
              <span className="team-highlight">BV Hardenberg</span> vs {nextMatch.away}
            </>
          ) : (
            <>
              {nextMatch.home} vs <span className="team-highlight">BV Hardenberg</span>
            </>
          )}
        </h2>
        <div className="hero-match-detail">
          <div className="detail-item">
            <Calendar size={15} />
            <span>{nextMatch.day} {nextMatch.date}</span>
          </div>
          <div className="detail-item">
            <Clock size={15} />
            <span>{nextMatch.time} uur</span>
          </div>
          <div className="detail-item">
            <MapPin size={15} />
            <a href={nextMatch.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="location-link">
              {nextMatch.location}
            </a>
          </div>
        </div>

        <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          {jaCount >= 4 ? (
            <span style={{ color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} /> {jaCount}/5 Spelers Aanwezig (Voldoende voor opstelling!)
            </span>
          ) : (
            <span style={{ color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={16} /> {jaCount}/5 Spelers Aanwezig (Nog {4 - jaCount} nodig)
            </span>
          )}
        </div>
      </div>

      {timeLeft && (
        <div className="countdown-box">
          <div className="countdown-unit">
            <div className="countdown-num">{timeLeft.days}</div>
            <div className="countdown-lbl">Dagen</div>
          </div>
          <div className="countdown-unit">
            <div className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="countdown-lbl">Uur</div>
          </div>
          <div className="countdown-unit">
            <div className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="countdown-lbl">Min</div>
          </div>
          <div className="countdown-unit">
            <div className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="countdown-lbl">Sec</div>
          </div>
        </div>
      )}
    </div>
  );
};
