'use client';

import React, { useState, useEffect } from 'react';
import { HARDENBERG_MATCHES, INITIAL_MATCHES, parseDate } from '@/lib/data';
import { Match, AvailabilityData, PlayerName, AvailabilityStatus, MatchExtra, PLAYERS } from '@/lib/types';
import { Header } from '@/components/Header';
import { HeroCountdown } from '@/components/HeroCountdown';
import { MatchCard } from '@/components/MatchCard';
import { ScheduleTable } from '@/components/ScheduleTable';
import { SporthallenGuide } from '@/components/SporthallenGuide';
import { StatsLineup } from '@/components/StatsLineup';
import { LoginModal } from '@/components/LoginModal';
import { Calendar, Shield, MapPin, BarChart3, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [activePlayer, setActivePlayer] = useState<PlayerName | null>(null);
  const [playerPassword, setPlayerPassword] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginTargetPlayer, setLoginTargetPlayer] = useState<PlayerName | null>(null);

  const [availabilityData, setAvailabilityData] = useState<AvailabilityData>({});
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [activeTab, setActiveTab] = useState<'HARDENBERG' | 'ALL' | 'HALLS' | 'STATS'>('HARDENBERG');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'UPCOMING' | 'PAST' | 'HOME' | 'AWAY' | 'READY' | 'NEED_PLAYERS'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [redisActive, setRedisActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load active player & session password
  useEffect(() => {
    const savedPlayer = localStorage.getItem('bv_hb_auth_player') as PlayerName | null;
    const savedPass = localStorage.getItem('bv_hb_auth_pass');
    if (savedPlayer && savedPass && PLAYERS.includes(savedPlayer)) {
      setActivePlayer(savedPlayer);
      setPlayerPassword(savedPass);
    }

    const savedAvail = localStorage.getItem('bv_hardenberg_availability');
    if (savedAvail) {
      try {
        setAvailabilityData(JSON.parse(savedAvail));
      } catch (e) {}
    }

    // Fetch from backend API
    fetch('/api/availability')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          if (json.data) {
            setAvailabilityData(prev => {
              const merged = { ...prev, ...json.data };
              localStorage.setItem('bv_hardenberg_availability', JSON.stringify(merged));
              return merged;
            });
          }
          if (json.redisActive) {
            setRedisActive(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleLoginSuccess = (player: PlayerName, pass: string) => {
    setActivePlayer(player);
    setPlayerPassword(pass);
    localStorage.setItem('bv_hb_auth_player', player);
    localStorage.setItem('bv_hb_auth_pass', pass);
    showToast(`🔑 Ingelogd als ${player}! Je kunt nu je eigen aanwezigheid wijzigen.`);
  };

  const handleLogout = () => {
    setActivePlayer(null);
    setPlayerPassword(null);
    localStorage.removeItem('bv_hb_auth_player');
    localStorage.removeItem('bv_hb_auth_pass');
    showToast('Uitgelogd');
  };

  const handleOpenLogin = (player?: PlayerName) => {
    setLoginTargetPlayer(player || null);
    setIsLoginOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };



  // Handle availability toggle with password authentication
  const handleUpdateStatus = async (matchId: string, player: PlayerName, status: AvailabilityStatus) => {
    if (!activePlayer || activePlayer !== player || !playerPassword) {
      handleOpenLogin(player);
      return;
    }

    setAvailabilityData(prev => {
      const matchObj = prev[matchId] || { players: {}, extra: {} };
      const newStatus = matchObj.players[player] === status ? 'onbekend' : status;
      const updatedPlayers = { ...matchObj.players, [player]: newStatus };
      const updatedData = { ...prev, [matchId]: { ...matchObj, players: updatedPlayers } };
      
      localStorage.setItem('bv_hardenberg_availability', JSON.stringify(updatedData));
      return updatedData;
    });

    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          player,
          status,
          password: playerPassword
        })
      });
      const resJson = await res.json();
      if (!resJson.success) {
        showToast(`Fout: ${resJson.error}`);
      }
    } catch (e) {}
  };

  // Handle extra match info
  const handleUpdateExtra = async (matchId: string, extraData: Partial<MatchExtra>) => {
    setAvailabilityData(prev => {
      const matchObj = prev[matchId] || { players: {}, extra: {} };
      const updatedExtra = { ...matchObj.extra, ...extraData };
      const updatedData = { ...prev, [matchId]: { ...matchObj, extra: updatedExtra } };
      
      localStorage.setItem('bv_hardenberg_availability', JSON.stringify(updatedData));
      return updatedData;
    });

    try {
      await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, ...extraData })
      });
    } catch (e) {}
  };

  // Live Sync with Motia
  const handleRefreshSchema = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/schema');
      const data = await res.json();
      if (data.success && data.matches && data.matches.length > 0) {
        setMatches(data.matches);
        showToast('Wedstrijdschema live bijgewerkt vanaf motia.nl!');
      } else {
        showToast('Kon live schema niet ophalen, standaard schema geladen.');
      }
    } catch (e) {
      showToast('Fout bij verbinden met motia.nl');
    } finally {
      setIsRefreshing(false);
    }
  };

  const hardenbergMatches = matches.filter(m => m.isHardenberg);
  const now = new Date();

  const upcomingHardenbergMatches = hardenbergMatches.filter(m => {
    const d = parseDate(m.date, m.time);
    return d >= now;
  });

  const nextMatch = upcomingHardenbergMatches.length > 0 ? upcomingHardenbergMatches[0] : hardenbergMatches[0] || null;

  const filteredHardenbergMatches = hardenbergMatches.filter(m => {
    const matchDate = parseDate(m.date, m.time);
    const isPast = matchDate < now;
    const jaCount = PLAYERS.filter(p => availabilityData[m.id]?.players?.[p] === 'ja').length;

    if (filterStatus === 'UPCOMING') return !isPast;
    if (filterStatus === 'PAST') return isPast;
    if (filterStatus === 'HOME') return m.isHome;
    if (filterStatus === 'AWAY') return !m.isHome;
    if (filterStatus === 'READY') return jaCount >= 4;
    if (filterStatus === 'NEED_PLAYERS') return jaCount < 4;
    return true;
  });

  return (
    <div>
      <Header
        activePlayer={activePlayer}
        redisActive={redisActive}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        onRefreshSchema={handleRefreshSchema}
        onShowToast={showToast}
        isRefreshing={isRefreshing}
      />

      <main className="main-wrapper">
        <HeroCountdown nextMatch={nextMatch} availabilityData={availabilityData} />

        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'HARDENBERG' ? 'active' : ''}`}
            onClick={() => setActiveTab('HARDENBERG')}
          >
            <Shield size={16} />
            <span>BV Hardenberg Wedstrijden</span>
            <span className="badge-count">{hardenbergMatches.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            <Calendar size={16} />
            <span>Volledig Competitieschema</span>
            <span className="badge-count">{matches.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'HALLS' ? 'active' : ''}`}
            onClick={() => setActiveTab('HALLS')}
          >
            <MapPin size={16} />
            <span>Sporthallen & Adressen</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'STATS' ? 'active' : ''}`}
            onClick={() => setActiveTab('STATS')}
          >
            <BarChart3 size={16} />
            <span>Team Statistieken</span>
          </button>
        </nav>

        {activeTab === 'HARDENBERG' && (
          <div>
            <div className="controls-bar">
              <div className="filter-pills">
                <button
                  className={`filter-chip ${filterStatus === 'ALL' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('ALL')}
                >
                  Alle Wedstrijden ({hardenbergMatches.length})
                </button>
                <button
                  className={`filter-chip ${filterStatus === 'UPCOMING' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('UPCOMING')}
                >
                  Aankomend ({hardenbergMatches.filter(m => parseDate(m.date, m.time) >= now).length})
                </button>
                <button
                  className={`filter-chip ${filterStatus === 'HOME' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('HOME')}
                >
                  🏠 Thuis (7)
                </button>
                <button
                  className={`filter-chip ${filterStatus === 'AWAY' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('AWAY')}
                >
                  🚌 Uit (7)
                </button>
                <button
                  className={`filter-chip ${filterStatus === 'READY' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('READY')}
                >
                  🟢 Compleet (≥4 spelers)
                </button>
                <button
                  className={`filter-chip ${filterStatus === 'NEED_PLAYERS' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('NEED_PLAYERS')}
                >
                  🟡 Zonder 4 spelers
                </button>
              </div>

              {activePlayer && (
                <div style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={15} />
                  <span>Ingelogd: <strong>{activePlayer}</strong> (Alleen jouw status is aanpasbaar)</span>
                </div>
              )}
            </div>

            <div className="match-cards-grid">
              {filteredHardenbergMatches.map(m => (
                <MatchCard
                  key={m.id}
                  match={m}
                  activePlayer={activePlayer}
                  availability={availabilityData[m.id]?.players || {}}
                  extra={availabilityData[m.id]?.extra}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateExtra={handleUpdateExtra}
                  onOpenLogin={handleOpenLogin}
                  onShowToast={showToast}
                />
              ))}
            </div>

            {filteredHardenbergMatches.length === 0 && (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-sub)' }}>
                Geen wedstrijden gevonden die voldoen aan dit filter.
              </div>
            )}
          </div>
        )}

        {activeTab === 'ALL' && <ScheduleTable matches={matches} />}
        {activeTab === 'HALLS' && <SporthallenGuide />}
        {activeTab === 'STATS' && <StatsLineup matches={matches} availabilityData={availabilityData} />}
      </main>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialPlayer={loginTargetPlayer}
      />

      {toastMessage && (
        <div className="toast-msg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
