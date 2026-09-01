'use client';

import React, { useState } from 'react';
import { Database, Download, CloudCheck, HardDrive, CheckCircle2 } from 'lucide-react';

interface SyncBarProps {
  redisActive: boolean;
  onShowToast: (msg: string) => void;
}

export const SyncBar: React.FC<SyncBarProps> = ({
  redisActive,
  onShowToast
}) => {
  const [showSyncModal, setShowSyncModal] = useState(false);

  const handleExport = () => {
    const raw = localStorage.getItem('bv_hardenberg_availability') || '{}';
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bv-hardenberg-aanwezigheid-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast('Aanwezigheid backup (.json) gedownload!');
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => setShowSyncModal(true)}
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-card)',
            color: 'var(--color-text-sub)',
            borderRadius: 20,
            padding: '0.25rem 0.65rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          {redisActive ? (
            <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CloudCheck size={14} />
              Redis DB Live
            </span>
          ) : (
            <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 4 }}>
              <HardDrive size={14} />
              Cloud Sync Actief
            </span>
          )}
        </button>
      </div>

      {showSyncModal && (
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
          <div className="glass-panel" style={{ maxWidth: 460, width: '100%', padding: '1.75rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Database size={18} style={{ color: '#10b981' }} />
                Cloud Database & Export
              </h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Alle keuzes van de spelers worden live opgeslagen in de Redis cloud database.
            </p>

            <div style={{ background: 'rgba(9, 13, 22, 0.8)', border: '1px solid var(--border-card)', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={15} style={{ color: '#34d399' }} />
                Redis Database Actief (redis-coffee-blanket)
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                Je gegevens worden permanent gesynchroniseerd in de Redis database.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                className="action-btn"
                onClick={handleExport}
                style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
              >
                <Download size={14} />
                Backup Exporteren (.json)
              </button>
            </div>

            <button
              onClick={() => setShowSyncModal(false)}
              className="player-btn"
              style={{ width: '100%', marginTop: '1rem', textAlign: 'center', justifyContent: 'center', display: 'block' }}
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </>
  );
};
