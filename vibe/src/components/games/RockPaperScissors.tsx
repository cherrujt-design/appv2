"use client";

import React, { useState } from "react";

const choices = ['Rock','Paper','Scissors'] as const;

function decide(a:string, b:string) {
  if (a === b) return 'Draw';
  if ((a === 'Rock' && b === 'Scissors') || (a === 'Paper' && b === 'Rock') || (a === 'Scissors' && b === 'Paper')) return 'You Win';
  return 'You Lose';
}

export default function RockPaperScissors(){
  const [result, setResult] = useState<string | null>(null);
  const [comp, setComp] = useState<string | null>(null);

  const play = (choice:string) => {
    const c = choices[Math.floor(Math.random()*choices.length)];
    setComp(c);
    setResult(decide(choice, c));
  };

  return (
    <div>
      <div style={{display:'flex', gap:8}}>
        {choices.map(c => (
          <button key={c} className="small" onClick={() => play(c)}>{c}</button>
        ))}
      </div>
      <div style={{marginTop:12}}>
        {result && (
          <div className="small">Computer: {comp} — <strong>{result}</strong></div>
        )}
      </div>
    </div>
  );
}
