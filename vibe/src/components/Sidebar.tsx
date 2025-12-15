import React, { useState } from "react";
import { MoreVertical, Search, MessageSquarePlus, CircleDashed, Menu, MessageSquare, Phone, Star, Archive, Settings, UserCircle } from "lucide-react";

type Friend = { email: string; name: string; status?: 'friend' | 'request' };

type Props = {
  friends: Friend[];
  onAddFriend: (f: Friend) => void;
  onAcceptRequest?: (f: Friend) => void;
  onBlockRequest?: (f: Friend) => void;
  onSelectFriend: (f: Friend) => void;
  selected?: string | null;
  signedIn: boolean;
  currentUser: { name: string; email: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
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

export default function Sidebar({ friends, onAddFriend, onAcceptRequest, onBlockRequest, onSelectFriend, selected, signedIn, currentUser, onSignIn, onSignOut, theme, toggleTheme, customBg, customText, uiStyle, setCustomBg, setCustomText, setUiStyle, resetSettings }: Props) {
  const [email, setEmail] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [audioVol, setAudioVol] = useState(() => {
    try { return (typeof window !== 'undefined' && localStorage.getItem('vibe:audio:vol')) || '0.6'; } catch (e) { return '0.6'; }
  });

  // State for Navigation
  const [activeTab, setActiveTab] = useState("chats"); // chats, calls, status, starred, archive, settings

  // Navigation Panel Item
  const NavItem = ({ icon: Icon, id, bottom }: { icon: any, id?: string, bottom?: boolean }) => {
    const isActive = activeTab === id;
    return (
      <div onClick={() => id && setActiveTab(id)} style={{
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        color: isActive ? '#fff' : '#aeaeae',
        position: 'relative',
        marginTop: bottom ? 'auto' : 0,
        background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
        borderRadius: 8,
        margin: '2px 6px'
      }}>
        {isActive && <div style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', height: 20, width: 3, background: '#25D366', borderRadius: '0 4px 4px 0' }} />}
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      </div>
    );
  };

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'row', padding: 0, background: '#2b2b2b', borderRight: '1px solid #3b3b3b', width: 350 }}>

      {/* Navigation Rail (Far Left) */}
      <div style={{
        width: 54,
        background: '#202020',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 10,
        paddingBottom: 10,
        gap: 4
      }}>
        {/* Top Icons */}
        <div style={{ marginBottom: 10, paddingLeft: 14 }}><Menu size={20} color="#aeaeae" /></div>

        <NavItem icon={MessageSquare} id="chats" />
        <NavItem icon={Phone} id="calls" />
        <NavItem icon={CircleDashed} id="status" />

        {/* Spacer to push bottom icons */}
        <div style={{ flex: 1 }} />

        {/* Bottom Icons */}
        <NavItem icon={Star} id="starred" />
        <NavItem icon={Archive} id="archive" />
        <div onClick={() => setShowSettings(true)}><NavItem icon={Settings} id="settings" /></div>

        <div onClick={signedIn ? onSignOut : onSignIn} title={signedIn ? "Sign Out" : "Sign In"} style={{ display: 'flex', justifyContent: 'center', marginTop: 10, cursor: 'pointer' }}>
          {signedIn && currentUser ? (
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#00a884', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
              {currentUser.name[0]}
            </div>
          ) : (
            <div style={{ padding: 10, color: '#aeaeae' }}><UserCircle size={24} /></div>
          )}
        </div>
      </div>

      {/* Main Content Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#2b2b2b', overflow: 'hidden' }}>

        {/* Header Dynamic Title */}
        <div style={{ height: 60, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#e1e1e1', textTransform: 'capitalize' }}>
            {activeTab}
          </h2>
          <div style={{ display: 'flex', gap: 16, color: '#aeaeae' }}>
            {activeTab === 'chats' && <MessageSquarePlus size={20} style={{ cursor: 'pointer' }} onClick={() => setShowAdd(s => !s)} />}
            <div style={{ position: 'relative' }}>
              <MoreVertical size={20} />
            </div>
          </div>
        </div>

        {/* Dynamic Content Body */}

        {/* CHATS TAB */}
        {activeTab === 'chats' && (
          <>
            {/* Search Bar */}
            <div style={{ padding: '0 16px 8px 16px' }}>
              <div style={{ background: '#202020', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '6px 12px', gap: 12, borderBottom: '1px solid #00a884' }}>
                <Search size={16} color="#aeaeae" />
                <input
                  placeholder="Search or start a new chat"
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 13, color: '#e1e1e1' }}
                />
              </div>
            </div>

            {/* Add Friend Input */}
            {showAdd && (
              <div style={{ padding: 12, background: '#333', display: 'flex', gap: 8 }}>
                <input
                  placeholder="New email..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, padding: 6, borderRadius: 4, border: 'none', background: '#444', color: 'white', outline: 'none' }}
                />
                <button onClick={() => {
                  if (!signedIn) return onSignIn();
                  if (!email) return;
                  onAddFriend({ email, name: email.split('@')[0] });
                  setEmail(""); setShowAdd(false);
                }} style={{ padding: '4px 12px', borderRadius: 4, border: 'none', background: '#00a884', color: 'white' }}>Add</button>
              </div>
            )}

            {/* List */}
            <div className="friends-list" style={{ background: 'transparent', overflowY: 'auto' }}>
              {friends.map(f => {
                if (f.status === 'request') {
                  return (
                    <div key={f.email} className="friend-request" style={{ padding: 15, borderBottom: '1px solid #3b3b3b', background: 'rgba(0,168,132,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#555', color: '#e1e1e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>?</div>
                        <div>
                          <div style={{ color: '#e1e1e1', fontWeight: 600 }}>{f.name}</div>
                          <div style={{ color: '#00a884', fontSize: 12 }}>Wants to correspond with you</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => onAcceptRequest?.(f)} style={{ flex: 1, padding: '6px 0', border: 'none', borderRadius: 4, background: '#00a884', color: 'white', cursor: 'pointer', fontWeight: 500 }}>Accept</button>
                        <button onClick={() => onBlockRequest?.(f)} style={{ flex: 1, padding: '6px 0', border: '1px solid #ea0038', borderRadius: 4, background: 'transparent', color: '#ea0038', cursor: 'pointer', fontWeight: 500 }}>Block</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={f.email} className="friend" onClick={() => onSelectFriend(f)} style={{
                    background: selected === f.email ? '#383838' : 'transparent',
                    borderBottom: '1px solid #3b3b3b',
                    padding: '10px 16px',
                    borderRadius: 0
                  }}>
                    <div className="avatar" style={{ width: 44, height: 44, background: '#555', color: '#e1e1e1' }}>{(f.name || f.email)[0].toUpperCase()}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 500, fontSize: 16, color: '#e1e1e1' }}>{f.name}</div>
                        <div className="small" style={{ fontSize: 11, color: '#888' }}>09/12/2025</div>
                      </div>
                      <div className="small" style={{ fontSize: 13, color: '#aaa', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: '#53bdeb' }}>✓✓</span> Click to chat
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* CALLS TAB */}
        {activeTab === 'calls' && (
          <div style={{ padding: 20, color: '#888', textAlign: 'center', marginTop: 50 }}>
            <div style={{ background: '#333', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Phone size={24} color="#e1e1e1" />
            </div>
            <div>No recent calls</div>
            <div style={{ fontSize: 12, marginTop: 10 }}>Make a call from a chat.</div>
          </div>
        )}

        {/* STATUS TAB */}
        {activeTab === 'status' && (
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #00a884', padding: 2 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#555' }}></div>
              </div>
              <div>
                <div style={{ color: '#e1e1e1', fontWeight: 500 }}>My Status</div>
                <div style={{ color: '#888', fontSize: 13 }}>No updates</div>
              </div>
            </div>
            <div style={{ color: '#00a884', fontSize: 13, fontWeight: 500, marginBottom: 10 }}>RECENT</div>
            <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: 13 }}>To view a status, tap the status ring.</div>
          </div>
        )}

        {/* ARCHIVE/STARRED */}
        {(activeTab === 'archive' || activeTab === 'starred') && (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            <div style={{ marginBottom: 20, opacity: 0.5 }}>
              {activeTab === 'archive' ? <Archive size={40} /> : <Star size={40} />}
            </div>
            No {activeTab} items found.
          </div>
        )}

      </div>

      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" style={{ background: '#2b2b2b', color: '#e1e1e1', border: '1px solid #444', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
            {/* Simplified Settings Content for brevity matching styling */}
            <div style={{ padding: 12 }}>
              <h3>Settings</h3>
              <div style={{ marginBottom: 10 }}>Theme: {theme}</div>
              <button onClick={toggleTheme}>Toggle Theme</button>
              <div style={{ marginTop: 20 }}>
                <button onClick={() => setShowSettings(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
