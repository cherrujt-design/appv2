"use client";

import React from "react";

// Single-clean AudioPlayer: hidden looping YouTube background music
export default function AudioPlayer() {
  const DEFAULT_YT = 'https://www.youtube.com/watch?v=Xkbqq0ZzCss&t=28s';

  function getYouTubeId(url?: string | null) {
    if(!url) return null;
    const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&\/]+)/);
    return m ? m[1] : null;
  }

  const ytId = getYouTubeId(DEFAULT_YT);

  if (!ytId) return null;

  return (
    <div style={{width:0, height:0, opacity:0, pointerEvents:'none'}} aria-hidden>
      <iframe
        title="Background music"
        width="0"
        height="0"
        style={{border:0, width:0, height:0, opacity:0}}
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&controls=0&rel=0&loop=1&playlist=${ytId}`}
        allow="autoplay; encrypted-media"
      />
    </div>
  );
}
