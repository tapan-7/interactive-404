"use client";

import { useEffect, useState } from "react";
import GameCanvas from "@/components/GameCanvas";
import { soundManager } from "@/game/audio/SoundManager";

export default function Home() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const unsubscribe = soundManager.subscribe((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  return (
    <main className="relative w-full h-full flex flex-col justify-between p-8 pointer-events-none select-none">
      <header className="flex justify-between items-center z-10 w-full pointer-events-auto">
        <h1 className="text-xl font-bold tracking-tighter uppercase">Tapan</h1>
      </header>

      {/* The Game Layer */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <GameCanvas />
      </div>

      <footer className="flex justify-between items-end z-10 w-full pointer-events-auto mt-auto">
        <button
          onClick={() => soundManager.toggleMute()}
          className="w-10 h-10 rounded-full bg-[#333333] text-[#e6e4dc] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
          aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <path
                d="M15.54 8.46a5 5 0 0 1 0 7.07"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M19.07 4.93a10 10 0 0 1 0 14.14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          )}
        </button>
      </footer>
    </main>
  );
}
