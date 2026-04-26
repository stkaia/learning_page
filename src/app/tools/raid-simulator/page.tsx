'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RaidSimulator() {
  const [diskCount, setDiskCount] = useState(4);
  const [diskSize, setDiskSize] = useState(1000); // in GB
  const [raidLevel, setRaidLevel] = useState('5');

  const calculateRaid = () => {
    let capacity = 0;
    let faultTolerance = 0;
    let readSpeed = 'Normal';
    let writeSpeed = 'Normal';

    switch (raidLevel) {
      case '0':
        capacity = diskCount * diskSize;
        faultTolerance = 0;
        readSpeed = 'Sehr hoch';
        writeSpeed = 'Sehr hoch';
        break;
      case '1':
        capacity = (diskCount / 2) * diskSize;
        faultTolerance = diskCount / 2;
        readSpeed = 'Hoch';
        writeSpeed = 'Normal';
        break;
      case '5':
        capacity = (diskCount - 1) * diskSize;
        faultTolerance = 1;
        readSpeed = 'Hoch';
        writeSpeed = 'Mittel (Parity-Berechnung)';
        break;
      case '6':
        capacity = (diskCount - 2) * diskSize;
        faultTolerance = 2;
        readSpeed = 'Hoch';
        writeSpeed = 'Niedrig (Doppelte Parity)';
        break;
      case '10':
        capacity = (diskCount / 2) * diskSize;
        faultTolerance = 1; // 1 per mirror set
        readSpeed = 'Sehr hoch';
        writeSpeed = 'Hoch';
        break;
    }

    return { capacity, faultTolerance, readSpeed, writeSpeed };
  };

  const result = calculateRaid();

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link href="/" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>← Menü</Link>
        <span style={{ fontWeight: 600 }}>RAID Simulator</span>
      </div>

      <div style={{ width: '100%', maxWidth: '800px', background: 'var(--card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>RAID Kapazität & Ausfallsicherheit</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>RAID Level</label>
            <select 
              value={raidLevel} 
              onChange={e => setRaidLevel(e.target.value)}
              style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)' }}
            >
              <option value="0">RAID 0 (Striping)</option>
              <option value="1">RAID 1 (Mirroring)</option>
              <option value="5">RAID 5 (Parity)</option>
              <option value="6">RAID 6 (Dual Parity)</option>
              <option value="10">RAID 10 (Striping + Mirroring)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Festplatten-Größe (GB)</label>
            <input 
              type="number" 
              value={diskSize} 
              onChange={e => setDiskSize(Number(e.target.value))}
              style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Anzahl Festplatten: {diskCount}</label>
          <input 
            type="range" 
            min={raidLevel === '1' || raidLevel === '0' ? 2 : raidLevel === '5' ? 3 : raidLevel === '6' || raidLevel === '10' ? 4 : 2} 
            max="24" 
            step={raidLevel === '1' || raidLevel === '10' ? 2 : 1}
            value={diskCount}
            onChange={e => setDiskCount(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem' }}>
            <span style={{ color: '#a1a1aa' }}>Nutzbare Kapazität:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{result.capacity >= 1000 ? `${(result.capacity / 1000).toFixed(1)} TB` : `${result.capacity} GB`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#a1a1aa' }}>Ausfallsicherheit:</span>
            <span style={{ fontWeight: 'bold' }}>{result.faultTolerance} {result.faultTolerance === 1 ? 'Festplatte' : 'Festplatten'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#a1a1aa' }}>Lese-Geschwindigkeit:</span>
            <span>{result.readSpeed}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a1a1aa' }}>Schreib-Geschwindigkeit:</span>
            <span>{result.writeSpeed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
