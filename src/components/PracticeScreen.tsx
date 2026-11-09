import { useEffect, useRef } from 'react';

/**
 * PracticeScreen Component
 *
 * Converted directly from 'practice screen.html'.
 * This is a pure presentational React component representing the WordMaster
 * Practice screen with neon-themed matching cards. No extra features were added.
 */
export default function PracticeScreen() {
  // Reference to the canvas element so we can draw neon lines on it
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // This effect handles the canvas setup and the sample connecting line
  // It runs once when the component mounts, and cleans up on unmount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draws a sample neon line from Hebrew "כלב" to English "Dog"
    function drawSampleLine() {
      if (!canvas || !ctx) return;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Example line from Hebrew "כלב" (approx center) to English "Dog"
      const startX = canvas.width * 0.45;
      const startY = canvas.height * 0.38; // Relative to the 2nd item
      const endX = canvas.width * 0.55;
      const endY = canvas.height * 0.18; // Relative to the 1st item

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);

      // Neon Glow styling
      ctx.strokeStyle = '#bc13fe';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#bc13fe';
      ctx.stroke();

      // Core white line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    // Small delay to let the layout settle before measuring canvas size
    const timer = setTimeout(drawSampleLine, 100);

    // Redraw the line whenever the window is resized
    window.addEventListener('resize', drawSampleLine);

    // Cleanup: remove the resize listener and cancel the timer on unmount
    return () => {
      window.removeEventListener('resize', drawSampleLine);
      clearTimeout(timer);
    };
  }, []);

  // Handles the card selection visual effect
  // When a card is clicked, it gets the 'selected-card' style
  // and all other cards in the same column lose the style
  const handleCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const section = btn.closest('section');
    if (!section) return;

    // Remove selection from all sibling cards in the same column
    section.querySelectorAll('button').forEach((b) => {
      b.classList.remove('selected-card');
    });

    // Mark this card as selected
    btn.classList.add('selected-card');
  };

  return (
    <div className="text-white min-h-screen flex flex-col">
      {/* Custom Styles for Specific Animations and Layouts */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .glow-pulse {
          animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .neon-border {
          border: 1px solid #00f2ff;
          box-shadow: inset 0 0 5px #00f2ff, 0 0 5px #00f2ff;
        }
        .selected-card {
          border-color: #bc13fe;
          box-shadow: inset 0 0 10px #bc13fe, 0 0 10px #bc13fe;
          transform: scale(1.02);
        }
        .matched-card {
          opacity: 0.5;
          border-color: #4ade80;
          box-shadow: none;
          pointer-events: none;
        }
        body {
          background-color: #0a0a12;
          background-image:
            radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a12 100%);
          overflow: hidden;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
      `}</style>

      {/* BEGIN: Header & Progress */}
      <header className="p-4 flex justify-between items-center bg-[#1a1a2e]/50 border-b border-[#00f2ff]/30">
        <div className="flex flex-col">
          <h1 className="text-[#00f2ff] font-bold tracking-widest text-lg uppercase italic">WordMaster</h1>
          <span className="text-xs text-[#bc13fe] font-mono">LEVEL: ELEMENTARY</span>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase text-gray-400 mb-1">Progress</div>
          <div className="flex items-center gap-2">
            <span className="text-[#00f2ff] font-bold">Round 1/5</span>
            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden border border-[#00f2ff]/20">
              <div className="w-1/5 h-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff,0_0_20px_#00f2ff]"></div>
            </div>
          </div>
        </div>
      </header>
      {/* END: Header & Progress */}

      {/* BEGIN: Game Arena */}
      <main className="flex-grow flex flex-col p-4 relative" data-purpose="matching-container">
        {/* Background Grid Effect */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#00f2ff 1px, transparent 1px), linear-gradient(90deg, #00f2ff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>

        <div className="flex justify-between gap-4 h-full items-center relative z-10">
          {/* BEGIN: Hebrew Column (Left) */}
          <section className="flex flex-col gap-4 w-1/2" data-purpose="hebrew-words">
            {/* Word Card 1 */}
            <button
              className="neon-border bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300 active:scale-95"
              data-id="1"
              onClick={handleCardClick}
            >
              <span className="text-xl font-bold block">בית</span>
            </button>
            {/* Word Card 2 (Simulating selection) */}
            <button
              className="neon-border selected-card bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300"
              data-id="2"
              onClick={handleCardClick}
            >
              <span className="text-xl font-bold block">כלב</span>
            </button>
            {/* Word Card 3 */}
            <button
              className="neon-border bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300"
              data-id="3"
              onClick={handleCardClick}
            >
              <span className="text-xl font-bold block">בית ספר</span>
            </button>
            {/* Word Card 4 */}
            <button
              className="neon-border bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300"
              data-id="4"
              onClick={handleCardClick}
            >
              <span className="text-xl font-bold block">תפוח</span>
            </button>
            {/* Word Card 5 */}
            <button
              className="neon-border bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300"
              data-id="5"
              onClick={handleCardClick}
            >
              <span className="text-xl font-bold block">שמש</span>
            </button>
          </section>
          {/* END: Hebrew Column */}

          {/* Canvas for connecting lines */}
          <canvas
            className="absolute inset-0 pointer-events-none w-full h-full"
            data-purpose="neon-lines"
            id="connection-canvas"
            ref={canvasRef}
          ></canvas>

          {/* BEGIN: English Column (Right) */}
          <section className="flex flex-col gap-4 w-1/2" data-purpose="english-words">
            {/* Word Card 1 */}
            <button
              className="neon-border bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300"
              data-id="A"
              onClick={handleCardClick}
            >
              <span className="text-lg font-bold block uppercase tracking-wider">Dog</span>
            </button>
            {/* Word Card 2 */}
            <button
              className="neon-border bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300"
              data-id="B"
              onClick={handleCardClick}
            >
              <span className="text-lg font-bold block uppercase tracking-wider">Sun</span>
            </button>
            {/* Word Card 3 */}
            <button
              className="neon-border bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300"
              data-id="C"
              onClick={handleCardClick}
            >
              <span className="text-lg font-bold block uppercase tracking-wider">School</span>
            </button>
            {/* Word Card 4 */}
            <button
              className="neon-border bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300"
              data-id="D"
              onClick={handleCardClick}
            >
              <span className="text-lg font-bold block uppercase tracking-wider">Apple</span>
            </button>
            {/* Word Card 5 */}
            <button
              className="neon-border bg-[#1a1a2e]/80 p-4 rounded-lg text-center transition-all duration-300"
              data-id="E"
              onClick={handleCardClick}
            >
              <span className="text-lg font-bold block uppercase tracking-wider">House</span>
            </button>
          </section>
          {/* END: English Column */}
        </div>
      </main>
      {/* END: Game Arena */}

      {/* BEGIN: Footer Navigation */}
      <footer className="p-6 bg-[#1a1a2e]/80 border-t border-[#bc13fe]/30 flex flex-col items-center gap-4">
        <div className="w-full flex justify-center">
          <button
            className="group relative px-12 py-3 bg-transparent overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
            id="next-button"
          >
            {/* Neon Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] opacity-80 group-hover:opacity-100 transition-opacity"></div>
            {/* Inner Border */}
            <div className="absolute inset-[2px] bg-[#0a0a12] rounded-full"></div>
            {/* Button Text */}
            <span className="relative z-10 text-[#00f2ff] font-black tracking-[0.2em] uppercase glow-pulse">Next Round</span>
          </button>
        </div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Connect all pairs to unlock Next</p>
      </footer>
      {/* END: Footer Navigation */}
    </div>
  );
}

