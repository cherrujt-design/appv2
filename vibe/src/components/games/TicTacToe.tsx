import React, { useState } from 'react';
import { X, Circle, RotateCcw, ArrowLeft } from 'lucide-react';

type Props = {
  onClose: () => void;
};

export default function TicTacToe({ onClose }: Props) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  function handleClick(i: number) {
    if (board[i] || winner) return;
    const nextBoard = board.slice();
    nextBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'white',
      animation: 'fadeIn 0.3s ease'
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer'
        }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          Chill Tac Toe
        </h2>
      </div>

      {/* Status */}
      <div style={{
        marginBottom: 20, fontSize: 20, fontWeight: 600,
        color: winner ? '#67E8F9' : '#e1e1e1',
        height: 30
      }}>
        {winner ? `Winner: ${winner}` : isDraw ? "It's a Vibe Draw!" : `Next Player: ${xIsNext ? 'X' : 'O'}`}
      </div>

      {/* Board */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: 10,
        background: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 20,
        backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} style={{
            width: 100, height: 100,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            fontSize: 0,
            cursor: cell || winner ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
            onMouseOver={e => !cell && !winner && (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            {cell === 'X' && <X size={60} color="#67E8F9" strokeWidth={2.5} />}
            {cell === 'O' && <Circle size={50} color="#FDE68A" strokeWidth={3} />}
          </button>
        ))}
      </div>

      {/* Reset */}
      <button onClick={reset} style={{
        marginTop: 30,
        background: 'linear-gradient(90deg, #FDE68A 0%, #FCA5A5 100%)',
        border: 'none', borderRadius: 50,
        padding: '12px 30px',
        color: '#333', fontWeight: 700, fontSize: 16,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 4px 15px rgba(253, 230, 138, 0.4)'
      }}>
        <RotateCcw size={18} /> New Game
      </button>

      <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
    </div>
  );
}

function calculateWinner(squares: any[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
