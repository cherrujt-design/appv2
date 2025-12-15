"use client";

import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";
import { Smile, Paperclip, Mic, Send, MoreVertical, Search, Lock, Phone, Video } from "lucide-react";

type Msg = { from: string; to: string; text: string; ts: number };

type Props = {
  me: { email: string; name: string } | null;
  friend: { email: string; name: string } | null;
  messages: Msg[];
  onSend: (m: Msg) => void;
  onCallStart: (video: boolean) => void;
};

export default function ChatWindow({ me, friend, messages, onSend, onCallStart }: Props) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, friend]);

  function send() {
    if (!me || !friend) return alert('Select friend and sign in');
    const t = text.trim();
    if (!t) return;
    const msg = { from: me.email, to: friend.email, text: t, ts: Date.now() };
    onSend(msg);
    setText("");
  }

  function addEmoji(e: string) { setText(s => s + e); }

  // Dark Theme Colors
  const darkBg = '#222222'; // Main chat area
  const darkPanel = '#2b2b2b'; // Sidebar-like or headers
  const darkText = '#e1e1e1';
  const darkSubText = '#888';
  const bubbleMe = '#005c4b';
  const bubbleThem = '#363636';

  if (!friend) return (
    <div className="chat-panel" style={{ alignItems: 'center', justifyContent: 'center', background: darkBg, border: 'none' }}>
      <div style={{ textAlign: 'center', color: darkSubText, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {/* WhatsApp Icon */}
        <div style={{ opacity: 0.3 }}>
          <svg viewBox="0 0 33 33" width="80" height="80" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M16.6 0C7.4 0 0 7.4 0 16.5c0 3 .8 5.9 2.3 8.4L.6 33l8.3-2.2c2.4 1.3 5.1 2 7.8 2 9.2 0 16.6-7.4 16.6-16.5S25.8 0 16.6 0zm0 29.8c-2.5 0-4.9-.7-7.1-1.9l-.5-.3-5.2 1.4 1.4-5.1-.3-.5C3.8 21.1 3.1 18.8 3.1 16.5c0-7.5 6-13.6 13.5-13.6 7.5 0 13.5 6.1 13.5 13.6 0 7.5-6.1 13.3-13.5 13.3z" />
            <path d="M22.4 18.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.9 1.1-1.1 1.3-.2.2-.5.3-.8.1-1.6-.8-2.6-1.4-3.6-3.2-.3-.5 0-.8.2-1 .2-.2.4-.5.6-.7.2-.2.3-.4.4-.7s.1-.5 0-.7c-.1-.2-.6-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.8 5.1 2.3 1 3.2 1.1 4.4 1 .8-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.4-.3-.7-.5z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontWeight: 400, color: darkText, opacity: 0.8, marginBottom: 8 }}>WhatsApp for Windows</h2>
          <div style={{ fontSize: 13, maxWidth: 360, lineHeight: 1.5 }}>
            Send and receive messages without keeping your phone online.<br />
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </div>
        </div>
        <div style={{ marginTop: 80, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.6 }}>
          <Lock size={12} /> End-to-end encrypted
        </div>
      </div>
    </div>
  );

  const convo = messages.filter(m => (m.from === me?.email && m.to === friend.email) || (m.from === friend.email && m.to === me?.email));

  return (
    <div className="chat-panel" style={{ background: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`, backgroundColor: '#0b141a' }}> {/* Dark doodle bg */}

      {/* Header */}
      <div className="header" style={{ background: darkPanel, borderBottom: '1px solid rgba(255,255,255,0.05)', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
            {friend.name[0].toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 500, color: darkText }}>{friend.name}</div>
            <div style={{ fontSize: 12, color: darkSubText }}>last seen today at 12:00 PM</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, color: darkSubText }}>
          <button className="icon-btn" onClick={() => onCallStart(true)} style={{ color: darkSubText }}><Video size={20} /></button>
          <button className="icon-btn" onClick={() => onCallStart(false)} style={{ color: darkSubText }}><Phone size={20} /></button>
          <div style={{ width: 1, background: '#444' }} />
          <Search size={20} />
        </div>
      </div>

      {/* Messages */}
      <div ref={boxRef} className="messages" style={{ padding: '20px 60px' }}>
        {convo.map((m, i) => (
          <div key={i} className={`message ${m.from === me?.email ? 'me' : 'them'}`}
            style={{
              background: m.from === me?.email ? bubbleMe : bubbleThem,
              color: '#e1e1e1',
              borderRadius: 8,
              boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
              maxWidth: '65%'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-end' }}>
              <span style={{ fontSize: 14.2, lineHeight: '19px' }}>{m.text}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', minWidth: 40, textAlign: 'right', marginBottom: -4 }}>
                {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {/* Tail Simulation could go here */}
          </div>
        ))}
      </div>

      {/* Emoji Panel */}
      {showEmoji && (
        <div style={{ height: 300, background: darkPanel, borderTop: '1px solid #444' }}>
          <EmojiPicker onPick={addEmoji} />
        </div>
      )}

      {/* Composer */}
      <div className="composer" style={{ background: darkPanel, borderTop: 'none', padding: '10px 16px', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, color: darkSubText }}>
          <button className="icon-btn" onClick={() => setShowEmoji(s => !s)} style={{ color: darkSubText }}><Smile size={24} /></button>
          <button className="icon-btn" style={{ color: darkSubText }}><Paperclip size={24} /></button>
        </div>

        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: 'none',
            fontSize: 15,
            outline: 'none',
            background: '#3d3d3d',
            color: darkText
          }}
        />

        {text.trim() ? (
          <button className="icon-btn" onClick={send} style={{ color: '#00a884' }}><Send size={24} /></button>
        ) : (
          <button className="icon-btn" style={{ color: darkSubText }}><Mic size={24} /></button>
        )}
      </div>
    </div>
  );
}
