'use client';

import Link from 'next/link';

export default function SqlDojo() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem 2rem', background: 'var(--bg)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', color: 'var(--foreground)' }}>← Menü</Link>
        <span style={{ fontWeight: 600, marginLeft: '1rem' }}>SQL Dojo</span>
      </div>
      
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe 
          src="/sql_dojo.html" 
          style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', top: 0, left: 0 }}
          title="SQL Dojo"
        />
      </div>
    </div>
  );
}
