"use client";

import React, { useState } from "react";

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);
  const handleClick = (i:number) => {
    if (winner || board[i]) return;
    const b = board.slice();
    b[i] = xIsNext ? 'X' : 'O';
    setBoard(b);
    setXIsNext(!xIsNext);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setXIsNext(true); };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div className="small">{winner ? `Winner: ${winner}` : `Next: ${xIsNext ? 'X' : 'O'}`}</div>
        <button className="small" onClick={reset}>Restart</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:12}}>
        {board.map((val, idx) => (
          <button key={idx} onClick={()=>handleClick(idx)} style={{padding:18, minHeight:56, fontSize:20, borderRadius:8}}>
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}
