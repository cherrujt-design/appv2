"use client";

import React, { useEffect, useState } from "react";

const EMOJIS = ['🐶','🐱','🦊','🐼','🦁','🐵','🐸','🐷'];

function shuffle<T>(arr:T[]) {
  const a = arr.slice();
  for (let i = a.length -1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryGame(){
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Record<number,boolean>>({});
  const [moves, setMoves] = useState(0);

  useEffect(()=>{
    reset();
  },[]);

  const reset = () => {
    const pairs = shuffle([...EMOJIS, ...EMOJIS]);
    setCards(pairs);
    setFlipped([]);
    setMatched({});
    setMoves(0);
  };

  const clickCard = (i:number) => {
    if (flipped.includes(i) || matched[i]) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m=>m+1);
      const [a,b] = next;
      if (cards[a] === cards[b]) {
        setMatched(m => ({...m, [a]:true, [b]:true}));
        setFlipped([]);
      } else {
        setTimeout(()=> setFlipped([]), 700);
      }
    }
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div className="small">Moves: {moves}</div>
        <button className="small" onClick={reset}>Reset</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:12}}>
        {cards.map((c, i) => {
          const isFlipped = flipped.includes(i) || matched[i];
          return (
            <button key={i} onClick={()=>clickCard(i)} style={{padding:16, minHeight:64, fontSize:24, borderRadius:8}}>
              {isFlipped ? c : '❓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
