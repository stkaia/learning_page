'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Packet = {
  version: string;
  src: string;
  dst: string;
  proto: string;
};

export default function HeaderTrainer() {
  const [packet, setPacket] = useState<Packet | null>(null);
  const [hexDump, setHexDump] = useState<string>('');
  const [inputs, setInputs] = useState({ version: '', src: '', dst: '', proto: '' });
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: React.ReactNode } | null>(null);

  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  const randByte = () => Math.floor(Math.random() * 256);

  const normalizeIP = (ip: string) => {
    let s = ip.toLowerCase().trim();
    if (s.includes(':')) {
      if (s.includes('::')) {
        const parts = s.split('::');
        const left = parts[0] ? parts[0].split(':') : [];
        const right = parts[1] ? parts[1].split(':') : [];
        const missing = 8 - (left.length + right.length);
        const middle = Array(missing).fill('0');
        s = [...left, ...middle, ...right].join(':');
      }
      return s.split(':').map(b => b.replace(/^0+/, '') || '0').join(':');
    }
    return s; 
  };

  const generateTask = () => {
    const isIPv4 = Math.random() > 0.5; 
    let hexArray: string[] = [];
    let newPacket: Packet;
    
    if (isIPv4) {
      const src = [192, 168, randByte(), randByte()];
      const dst = [10, 0, randByte(), randByte()];
      const protocols = [{hex: '06', name: 'TCP'}, {hex: '11', name: 'UDP'}, {hex: '01', name: 'ICMP'}];
      const proto = protocols[Math.floor(Math.random() * protocols.length)];

      hexArray = [
        '45', '00', '00', '3C', 
        toHex(randByte()), toHex(randByte()), '40', '00', 
        '40', proto.hex, toHex(randByte()), toHex(randByte()), 
        toHex(src[0]), toHex(src[1]), toHex(src[2]), toHex(src[3]), 
        toHex(dst[0]), toHex(dst[1]), toHex(dst[2]), toHex(dst[3]), 
        toHex(randByte()), toHex(randByte()), toHex(randByte()), toHex(randByte()) 
      ];

      newPacket = { version: "IPv4", src: src.join('.'), dst: dst.join('.'), proto: proto.name };
    } else {
      const srcHex = ['20', '01', '0D', 'B8', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', toHex(randByte())];
      const dstHex = ['2A', '02', '02', 'E0', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', toHex(randByte())];
      const protocols = [{hex: '06', name: 'TCP'}, {hex: '11', name: 'UDP'}, {hex: '3A', name: 'ICMPv6'}];
      const proto = protocols[Math.floor(Math.random() * protocols.length)];

      hexArray = [
        '60', '00', '00', '00', 
        '00', '40', proto.hex, '40', 
        ...srcHex, 
        ...dstHex, 
        toHex(randByte()), toHex(randByte()) 
      ];

      const srcFull = srcHex.join('').match(/.{1,4}/g)!.join(':');
      const dstFull = dstHex.join('').match(/.{1,4}/g)!.join(':');

      newPacket = { version: "IPv6", src: srcFull, dst: dstFull, proto: proto.name };
    }

    let dumpText = "";
    for (let i = 0; i < hexArray.length; i++) {
      dumpText += hexArray[i] + " ";
      if ((i + 1) % 16 === 0) dumpText += "\n";
    }
    
    setHexDump(dumpText);
    setPacket(newPacket);
    setInputs({ version: '', src: '', dst: '', proto: '' });
    setFeedback(null);
  };

  useEffect(() => {
    generateTask();
  }, []);

  const checkAnswers = () => {
    if (!packet) return;

    const v = inputs.version.trim().toLowerCase();
    const s = inputs.src.trim();
    const d = inputs.dst.trim();
    const p = inputs.proto.trim().toLowerCase();

    const errors: string[] = [];

    if (v !== packet.version.toLowerCase()) errors.push(`Version ist falsch.`);
    
    if (normalizeIP(s) !== normalizeIP(packet.src)) {
      const shortSrc = packet.src.replace(/(^|:)0+(?=[1-9a-fA-F])/g, '$1').replace(/(^|:)0(:0)+/g, '::');
      errors.push(`Senderadresse stimmt nicht. Erwartet: ${shortSrc}`);
    }
    if (normalizeIP(d) !== normalizeIP(packet.dst)) {
      const shortDst = packet.dst.replace(/(^|:)0+(?=[1-9a-fA-F])/g, '$1').replace(/(^|:)0(:0)+/g, '::');
      errors.push(`Empfängeradresse stimmt nicht. Erwartet: ${shortDst}`);
    }
    
    if (p !== packet.proto.toLowerCase()) errors.push(`Protokoll ist falsch. Richtig wäre ${packet.proto}.`);

    if (errors.length === 0) {
      setFeedback({ isCorrect: true, message: <span>✅ <b>Perfekt!</b> Alle Felder wurden korrekt aus dem Trace ausgelesen.</span> });
    } else {
      setFeedback({ isCorrect: false, message: <span>❌ <b>Fehler gefunden:</b><br/> - {errors.map((e, i) => <span key={i}>{e}<br/> - </span>)}</span> });
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link href="/" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>← Menü</Link>
        <span style={{ fontWeight: 600 }}>Header-Detektiv</span>
      </div>

      <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '500px', background: 'var(--card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Aufgabe: Trace Analyse</h2>
          <p style={{ marginBottom: '1rem', color: '#a1a1aa' }}>Mit einem Analyseprogramm wurde folgender Netzwerkverkehr aufgezeichnet:</p>
          
          <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', background: '#000', color: '#4ade80', padding: '20px', borderRadius: '8px', letterSpacing: '2px', lineHeight: '1.8', whiteSpace: 'pre', overflowX: 'auto', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }}>
            {hexDump || 'Lade Trace...'}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>1. Protokollversion (z.B. IPv4 oder IPv6)</label>
              <input type="text" value={inputs.version} onChange={e => setInputs({...inputs, version: e.target.value})} placeholder="IPv4" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>2. Senderadresse (Dezimal für v4, Hex für v6)</label>
              <input type="text" value={inputs.src} onChange={e => setInputs({...inputs, src: e.target.value})} placeholder="z.B. 2001:db8::48" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>3. Empfängeradresse (Dezimal für v4, Hex für v6)</label>
              <input type="text" value={inputs.dst} onChange={e => setInputs({...inputs, dst: e.target.value})} placeholder="z.B. 2a02:2e0::d2" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>4. Eingebettetes Protokoll / Next Header</label>
              <input type="text" value={inputs.proto} onChange={e => setInputs({...inputs, proto: e.target.value})} placeholder="TCP" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={checkAnswers} style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>Antworten prüfen</button>
              <button onClick={generateTask} style={{ flex: 1, padding: '1rem', background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>Neuen Trace würfeln</button>
            </div>

            {feedback && (
              <div style={{ marginTop: '1rem', padding: '1.5rem', background: feedback.isCorrect ? 'var(--success-bg)' : 'var(--error-bg)', borderLeft: `4px solid ${feedback.isCorrect ? 'var(--success)' : 'var(--error)'}`, borderRadius: '0 8px 8px 0' }}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '400px', background: 'var(--card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>Spickzettel (IHK Referenz)</h2>
          
          <h3 style={{ marginBottom: '1rem' }}>IPv4 Header (20 Bytes)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.9rem' }}>
            <tbody>
              <tr><th colSpan={1} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 0</th><th colSpan={1} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 1</th><th colSpan={2} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 2-3</th></tr>
              <tr><td style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>Ver / IHL</td><td style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>TOS</td><td colSpan={2} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>Gesamtlänge</td></tr>
              <tr><th colSpan={2} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 4-5</th><th colSpan={2} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 6-7</th></tr>
              <tr><td colSpan={2} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>Ident</td><td colSpan={2} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>Flags / Offset</td></tr>
              <tr><th colSpan={1} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 8</th><th colSpan={1} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 9</th><th colSpan={2} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 10-11</th></tr>
              <tr><td style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>TTL</td><td style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}><b>Protocol</b></td><td colSpan={2} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>Checksum</td></tr>
              <tr><th colSpan={4} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 12 - 15</th></tr>
              <tr><td colSpan={4} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}><b>Source Address (32 Bit)</b></td></tr>
              <tr><th colSpan={4} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 16 - 19</th></tr>
              <tr><td colSpan={4} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}><b>Destination Address (32 Bit)</b></td></tr>
            </tbody>
          </table>

          <h3 style={{ marginBottom: '1rem' }}>IPv6 Header (40 Bytes)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.9rem' }}>
            <tbody>
              <tr><th colSpan={4} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 0 - 3</th></tr>
              <tr><td colSpan={4} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>Version (4b) | Traffic Class (8b) | Flow Label (20b)</td></tr>
              <tr><th colSpan={2} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 4 - 5</th><th colSpan={1} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 6</th><th colSpan={1} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 7</th></tr>
              <tr><td colSpan={2} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>Payload Length</td><td style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}><b>Next Header</b></td><td style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}>Hop Limit</td></tr>
              <tr><th colSpan={4} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 8 - 23 (16 Bytes)</th></tr>
              <tr><td colSpan={4} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}><b>Source Address (128 Bit)</b></td></tr>
              <tr><th colSpan={4} style={{ border: '1px solid #475569', padding: '8px', background: '#334155' }}>Byte 24 - 39 (16 Bytes)</th></tr>
              <tr><td colSpan={4} style={{ border: '1px solid #475569', padding: '8px', textAlign: 'center' }}><b>Destination Address (128 Bit)</b></td></tr>
            </tbody>
          </table>

          <h3 style={{ marginBottom: '1rem' }}>Wichtige Protokoll-IDs (Hex)</h3>
          <ul style={{ listStylePosition: 'inside', color: '#cbd5e1' }}>
            <li><b>01</b> = ICMP</li>
            <li><b>06</b> = TCP</li>
            <li><b>11</b> = UDP (Dezimal 17)</li>
            <li><b>3A</b> = ICMPv6 (Dezimal 58)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
