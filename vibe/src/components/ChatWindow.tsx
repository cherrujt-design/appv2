"use client";

import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";
import { Smile, Send, ArrowLeft, Gamepad2, Settings, Play, Volume2 } from "lucide-react";

type Msg = { from: string; to: string; text: string; ts: number };

type Props = {
  me: { email: string; name: string } | null;
  friend: { email: string; name: string } | null;
  messages: Msg[];
  onSend: (m: Msg) => void;
  onCallStart: (video: boolean) => void;
  onBack?: () => void;
};

export default function ChatWindow({ me, friend, messages, onSend, onCallStart, onBack }: Props) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, friend]);

  function send() {
    if (!me || !friend) return;
    const t = text.trim();
    if (!t) return;
    const msg = { from: me.email, to: friend.email, text: t, ts: Date.now() };
    onSend(msg);
    setText("");
  }

  function addEmoji(e: string) { setText(s => s + e); }

  if (!friend) return null;

  const convo = messages.filter(m => (m.from === me?.email && m.to === friend.email) || (m.from === friend.email && m.to === me?.email));

  return (
    <div className="chat-window" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: "url('https://images.unsplash.com/photo-1614730341194-75c60740a0fd?q=80&w=2874&auto=format&fit=crop')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Outfit", sans-serif'
    }}>
      {/* Overlay for readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{
        height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 30px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Back Button */}
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><ArrowLeft size={28} /></button>

          {/* Avatar */}
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#5C4033', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 600, border: '2px solid rgba(255,255,255,0.3)' }}>
            {friend.name[0].toUpperCase()}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>{friend.name}</div>
            <div style={{ color: '#67E8F9', fontSize: 14, fontWeight: 500 }}>Online</div>
          </div>
        </div>

        {/* Settings Fab */}
        <div style={{
          width: 45, height: 45, borderRadius: '50%',
          background: '#25D366', // WhatsApp-ish green from design
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }}>
          <Settings size={24} color="white" />
        </div>
      </div>

      {/* Messages Area */}
      <div ref={boxRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 40px', display: 'flex', flexDirection: 'column', gap: 15, zIndex: 10 }}>
        {convo.map((m, i) => {
          const isMe = m.from === me?.email;
          return (
            <div key={i} style={{
              alignSelf: isMe ? 'flex-end' : 'flex-start',
              maxWidth: '60%',
              background: isMe ? 'rgba(103, 232, 249, 0.8)' : 'rgba(255, 255, 255, 0.2)', // Cyan for me, Glass for them
              backdropFilter: 'blur(10px)',
              padding: '12px 20px',
              borderRadius: 20,
              borderBottomRightRadius: isMe ? 4 : 20,
              borderBottomLeftRadius: isMe ? 20 : 4,
              color: isMe ? '#0ca678' : 'white',
              fontWeight: 500,
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              {m.text}
            </div>
          );
        })}
      </div>

      {/* Footer / Composer */}
      <div style={{
        height: 100,
        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 10
      }}>
        {/* Music Widget (Left) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: 50,
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          color: 'white',
          marginRight: 40
        }}>
          <div style={{ fontSize: 18 }}>🎵</div>
          <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>Chill Lofi</div>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
          <Play size={16} fill="white" />
          <Volume2 size={16} />
        </div>

        {/* Input Area (Center) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 15, maxWidth: 800 }}>
          {/* Game Icon */}
          <div style={{ width: 45, height: 45, borderRadius: '50%', background: '#FFB800', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Gamepad2 size={24} color="white" />
          </div>

          {/* Smiley */}
          <div onClick={() => setShowEmoji(!showEmoji)} style={{ cursor: 'pointer', color: 'white', opacity: 0.8 }}>
            <Smile size={30} />
          </div>

          {/* Text Input */}
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a chill message..."
            style={{
              flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 50,
              padding: '15px 25px', color: 'white', fontSize: 16, outline: 'none',
              backdropFilter: 'blur(5px)'
            }}
          />

          {/* Send Button */}
          <button onClick={send} style={{
            width: 50, height: 50, borderRadius: '50%', background: '#8B5CF6', // Purple
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
          }}>
            <Send size={24} color="white" />
          </button>
        </div>
      </div>

      {/* Emoji Picker Overlay */}
      {showEmoji && (
        <div style={{ position: 'absolute', bottom: 110, left: 250, zIndex: 20 }}>
          <EmojiPicker onPick={addEmoji} />
        </div>
      )}

    </div>
  );
}
