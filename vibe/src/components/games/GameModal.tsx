"use client";

import React, { useState } from "react";
import TicTacToe from "./TicTacToe";
import RockPaperScissors from "./RockPaperScissors";
import MemoryGame from "./MemoryGame";
import { X } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export default function GameModal({ open, onClose }: Props) {
  const [tab, setTab] = useState("tictactoe");
  if (!open) return null;

  return (
    <div className="settings-overlay game-overlay" role="dialog" aria-modal="true">
      <div className="settings-modal game-modal" style={{width: '720px', maxWidth: '96%'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
          <h3 style={{margin:0}}>Games</h3>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <div style={{display:'flex', gap:6}}>
              <button className={`small ${tab==='tictactoe'?'on':''}`} onClick={()=>setTab('tictactoe')}>Tic Tac Toe</button>
              <button className={`small ${tab==='rps'?'on':''}`} onClick={()=>setTab('rps')}>Rock Paper Scissors</button>
              <button className={`small ${tab==='memory'?'on':''}`} onClick={()=>setTab('memory')}>Memory</button>
            </div>
            <button className="icon-btn" onClick={onClose} aria-label="Close games"><X size={16} /></button>
          </div>
        </div>

        <div style={{marginTop:12}} className="game-grid">
          {tab === 'tictactoe' && <TicTacToe />}
          {tab === 'rps' && <RockPaperScissors />}
          {tab === 'memory' && <MemoryGame />}
        </div>
      </div>
    </div>
  );
}
