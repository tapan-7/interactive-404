"use client";

import { useEffect, useRef, useState } from "react";
import { Engine, GameState } from "../game/engine/Engine";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [gameState, setGameState] = useState<GameState>("IDLE");

  useEffect(() => {
    if (!canvasRef.current) return;

    engineRef.current = new Engine(canvasRef.current, (state) => {
      setGameState(state);
    });

    const handleResize = () => {
      if (canvasRef.current && engineRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        engineRef.current.handleResize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    engineRef.current.start();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Subtle UI text based on state */}
      {gameState === "IDLE" && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto flex items-center justify-center transition-opacity duration-500">
          <span className="text-xs font-bold tracking-widest uppercase text-[#1d1d1d]">
            ( PRESS SPACE TO START )
          </span>
        </div>
      )}

      {gameState === "PAUSED" && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto flex items-center justify-center transition-opacity duration-500">
          <span className="text-xs font-bold tracking-widest uppercase text-[#1d1d1d]">
            ( PAUSED - PRESS SPACE TO RESUME )
          </span>
        </div>
      )}

      {gameState === "GAMEOVER" && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto flex items-center justify-center transition-opacity duration-500">
          <span className="text-xs font-bold tracking-widest uppercase text-[#1d1d1d]">
            ( GAME OVER - PRESS SPACE TO START )
          </span>
        </div>
      )}
    </div>
  );
}
