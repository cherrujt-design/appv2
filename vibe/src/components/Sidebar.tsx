"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";

type Friend = { email: string; name: string };

type Props = {
  friends: Friend[];
  onAddFriend: (f: Friend) => void;
  onSelectFriend: (f: Friend) => void;
  selected?: string | null;
  signedIn: boolean;
  theme: string;
  toggleTheme: () => void;
  customBg: string;
  customText: string;
  uiStyle: string;
  setCustomBg: (s: string) => void;
  setCustomText: (s: string) => void;
  setUiStyle: (s: string) => void;
  resetSettings: () => void;
};

export default function Sidebar({ friends, onAddFriend, onSelectFriend, selected, signedIn, theme, toggleTheme, customBg, customText, uiStyle, setCustomBg, setCustomText, setUiStyle, resetSettings }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [audioVol, setAudioVol] = useState(() => {
    try { return (typeof window !== 'undefined' && localStorage.getItem('vibe:audio:vol')) || '0.6'; } catch (e) { return '0.6'; }
  });

  function add() {
    if (!signedIn) return alert('Please sign in first');
    if (!email) return;
    onAddFriend({ email, name: name || email.split('@')[0] });
    setEmail(""); setName("");
  }

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Friends</h3>
          <button aria-label="Settings" title="Settings" onClick={() => setShowSettings(s => !s)} className="icon-btn">
            <Settings size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Friend email" value={email} onChange={e => setEmail(e.target.value)} />
          <button onClick={add}>Add</button>
        </div>
        {showSettings && (
          <div className="settings-overlay" onClick={() => setShowSettings(false)}>
            <div className="settings-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4a1 1 0 011 1v1.1a7 7 0 014.9 4.9H19a1 1 0 011 1v2a1 1 0 01-1 1h-1.1a7 7 0 01-4.9 4.9V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1.1a7 7 0 01-4.9-4.9H5a1 1 0 01-1-1v-2a1 1 0 011-1h1.1A7 7 0 019 6.1V5a1 1 0 011-1h2z" fill="currentColor" opacity="0.6" /></svg>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Appearance</div>
                </div>
                <button className="icon-btn" onClick={() => setShowSettings(false)} aria-label="Close settings">✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="small" style={{ fontSize: 11, opacity: 0.8 }}>Background (Anime Style)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                    {[
                      { name: 'Default', value: '' },
                      { name: 'Sakura', value: "url('https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Tokyo', value: "url('https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Clouds', value: "url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Cozy', value: "url('https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Camping', value: "url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Beach', value: "url('https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Mountain', value: "url('https://images.unsplash.com/photo-1570641963303-92ce4845ed4c?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Sea', value: "url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Cyber', value: "url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Art', value: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80')" },
                      { name: 'Dusk', value: 'linear-gradient(to bottom, #2b5876, #4e4376)' },
                    ].map((bg, i) => (
                      <button
                        key={i}
                        title={bg.name}
                        onClick={() => setCustomBg(bg.value)}
                        style={{
                          width: '100%', aspectRatio: '1.8/1', borderRadius: 4, border: customBg === bg.value ? '2px solid var(--accent)' : '1px solid rgba(128,128,128,0.2)',
                          background: bg.value || '#f7f5f2', backgroundSize: 'cover', cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                    <label className="small" style={{ opacity: 0.6, fontSize: 10 }}>Custom Color</label>
                    <input type="color" value={customBg?.startsWith('#') ? customBg : '#f7f5f2'} onChange={e => setCustomBg(e.target.value)} style={{ height: 24, width: 32, padding: 1 }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <label className="small" style={{ fontSize: 11, opacity: 0.8 }}>Text</label>
                    <input type="color" value={customText || '#111827'} onChange={e => setCustomText(e.target.value)} style={{ width: '100%', height: 28, padding: 2 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <label className="small" style={{ fontSize: 11, opacity: 0.8 }}>Style</label>
                    <select value={uiStyle || 'square'} onChange={e => setUiStyle(e.target.value)} style={{ width: '100%', height: 28, fontSize: 12, padding: '0 4px' }}>
                      <option value="rounded">Rounded</option>
                      <option value="square">Square</option>
                      <option value="compact">Compact</option>
                      <option value="sketch">Sketch</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <label className="small" style={{ fontSize: 11, opacity: 0.8 }}>Music Volume</label>
                  <input type="range" min={0} max={1} step={0.01} value={Number(audioVol)} onChange={e => {
                    const v = String(e.target.value);
                    setAudioVol(v);
                    try { localStorage.setItem('vibe:audio:vol', v); } catch (e) { }
                    window.dispatchEvent(new CustomEvent('vibe:audio:vol', { detail: v }));
                  }} style={{ height: 4 }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <button onClick={() => { setCustomBg(''); setCustomText(''); setUiStyle('square'); try { localStorage.removeItem('vibe:audio:vol'); } catch (e) { } window.dispatchEvent(new CustomEvent('vibe:audio:vol', { detail: '0.6' })); if (typeof resetSettings === 'function') resetSettings(); }} className="small" style={{ padding: '4px 8px', fontSize: 11 }}>Reset Defaults</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="friends-list">
          {friends.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }} className="small">No friends yet — add by email</div>
          ) : (
            friends.map(f => (
              <div key={f.email} className="friend" onClick={() => onSelectFriend(f)} style={{ background: selected === f.email ? 'rgba(37,99,235,0.12)' : 'transparent' }}>
                <div className="avatar">{(f.name || f.email)[0].toUpperCase()}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 600 }}>{f.name}</div>
                  <div className="small">{f.email}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
