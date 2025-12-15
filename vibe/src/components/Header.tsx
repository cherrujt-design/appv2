"use client";

import React, { useState } from "react";
import { MessageCircle, Gamepad } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import GameModal from "./games/GameModal";

type Props = {
  user: { name: string; email: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  theme: string;
  toggleTheme: () => void;
};

export default function Header({ user, onSignIn, onSignOut, theme, toggleTheme }: Props) {
  const [gamesOpen, setGamesOpen] = useState(false);
  return (
    <div className="header">
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <MessageCircle size={28} />
        <h2 style={{margin:0}}>Vibe Chat</h2>
        <span className="small">{user ? `Signed in as ${user.name}` : 'Not signed in'}</span>
      </div>

      <div className="control-row">
          <AudioPlayer />
          <button aria-label="Games" title="Games" className="icon-btn game-btn" onClick={() => setGamesOpen(true)}>
            <Gamepad size={18} />
          </button>
          {user ? (
            <button onClick={onSignOut} className="small">Logout</button>
          ) : (
            <button onClick={onSignIn} className="small">Sign in with Google</button>
          )}
      </div>
      <GameModal open={gamesOpen} onClose={() => setGamesOpen(false)} />
    </div>
  );
}
