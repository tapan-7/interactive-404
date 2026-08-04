"use client";

import { useEffect, useRef, useState } from "react";
import { Engine } from "../game/engine/Engine";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Engine once
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

    // The Engine handles its own requestAnimationFrame, we just start it
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
      
      {gameState === "GAMEOVER" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#e6e4dc]/80 backdrop-blur-sm z-50">
          <div className="text-center text-[#1d1d1d]">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest">Game Over</h2>
            <p className="font-medium tracking-wide">Press SPACE or ENTER to restart</p>
          </div>
        </div>
      )}
    </div>
  );
}
