"use client";

import React from "react";

type Props = { onPick: (s: string) => void };

const EMOJI = ["😀","😂","😍","😢","👍","🎉","🔥","🙏","😅","😎"];

export default function EmojiPicker({ onPick }: Props) {
  return (
    <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
      {EMOJI.map(e=> (
        <button key={e} onClick={()=>onPick(e)} style={{padding:6, borderRadius:6}}>{e}</button>
      ))}
    </div>
  );
}
