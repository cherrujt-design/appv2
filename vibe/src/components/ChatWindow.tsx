"use client";

import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";

type Msg = { from: string; to: string; text: string; ts: number };

type Props = {
  me: { email: string; name: string } | null;
  friend: { email: string; name: string } | null;
  messages: Msg[];
  onSend: (m: Msg) => void;
};

export default function ChatWindow({ me, friend, messages, onSend }: Props) {
  const [text, setText] = useState("");
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
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

  function addEmoji(e:string){ setText(s=> s + e); }

  if (!friend) return <div className="chat-panel"><div className="small">Select a friend to start chatting.</div></div>;

  const convo = messages.filter(m => (m.from===me?.email && m.to===friend.email) || (m.from===friend.email && m.to===me?.email));

  return (
    <div className="chat-panel">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontWeight:700}}>{friend.name}</div>
          <div className="small">{friend.email}</div>
        </div>
        <div className="small">{new Date().toLocaleString()}</div>
      </div>

      <div ref={boxRef} className="messages">
        {convo.map((m,i)=> (
          <div key={i} className={`message ${m.from===me?.email? 'me':'them'}`}>
            <div style={{fontSize:12, opacity:0.9}}>{m.from===me?.email? 'You': friend.name}</div>
            <div>{m.text}</div>
            <div className="small" style={{textAlign:'right'}}>{new Date(m.ts).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <div className="composer">
        <EmojiPicker onPick={addEmoji} />
      </div>
      <div className="composer">
        <textarea rows={2} value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message or add emojis" />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
