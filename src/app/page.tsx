import GameCanvas from "@/components/GameCanvas";

export default function Home() {
  return (
    <main className="relative w-full h-full flex flex-col justify-between p-8 pointer-events-none select-none">
      <header className="flex justify-between items-center z-10 w-full pointer-events-auto">
        <h1 className="text-xl font-bold tracking-tighter uppercase">Aence</h1>
        <nav className="flex gap-6 text-sm font-medium tracking-wide">
          <a href="#" className="hover:opacity-70 transition-opacity">WORK</a>
          <a href="#" className="hover:opacity-70 transition-opacity">STUDIO</a>
          <a href="#" className="hover:opacity-70 transition-opacity">COMPONENTS</a>
          <a href="#" className="hover:opacity-70 transition-opacity">CONTACT</a>
        </nav>
      </header>

      {/* The Game Layer */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <GameCanvas />
      </div>

      <footer className="flex justify-between items-end z-10 w-full pointer-events-auto mt-auto">
        <button className="w-10 h-10 rounded-full bg-[#333333] text-[#e6e4dc] flex items-center justify-center hover:scale-105 transition-transform" aria-label="N Icon">
          <span className="text-sm font-medium">N</span>
        </button>
        <button className="w-10 h-10 rounded-full bg-[#333333] text-[#e6e4dc] flex items-center justify-center hover:scale-105 transition-transform" aria-label="Toggle Sound">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </footer>
    </main>
  );
}
