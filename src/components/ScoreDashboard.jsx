import React from 'react';

/**
 * ScoreDashboard Component
 * 
 * Converted directly from 'screen showing a score.html'.
 * This is a pure presentational React component representing the WordMaster
 * Dashboard & Score screen. No external dependencies or extra features were added.
 */
export default function ScoreDashboard() {
  return (
    <div className="min-h-screen pb-24 bg-[#0d0d12] text-white font-sans overflow-x-hidden">
      {/* Scoped CSS for glassmorphism and animations */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>

      {/* BEGIN: Header */}
      <header className="p-6 pt-10" data-purpose="user-greeting">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Hello, <span className="text-[#00f2ff]">Alex</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Ready to master new words today?</p>
          </div>
          {/* Profile Avatar Placeholder */}
          <div className="w-12 h-12 rounded-full border-2 border-[#bc13fe] overflow-hidden p-0.5">
            <img
              alt="User Profile"
              className="w-full h-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCetkqATz-JLS7KeOIFDbXIcLE2bwgFLf95P4kL_LaPDCrcjPxcOR1mWR7YAKtTTSO3M4Ys_R4luojoEun22TukK19uNsjfTHid9bIn6L3Z4tWThawfaM__lXuxh0N_yQFSScZMN__lh1sNyLOqWKRoTFJWKtVzqrmZmnectT7hzn-bB9jqpT2Hg8QKMiZDfE_Yl6N4_pHjIOboBucRsVmJhqJKj3PFLc05OUifDiKNuRlSN8AP8ZfFs3z38PzkJWRLp7f10w0TKJtr"
            />
          </div>
        </div>
      </header>
      {/* END: Header */}

      <main className="px-6 space-y-8">
        {/* BEGIN: Progress Section */}
        <section className="flex flex-col items-center justify-center py-4" data-purpose="progress-tracker">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="112"
                cy="112"
                fill="transparent"
                r="95"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="12"
              />
              {/* Glowing Progress Bar */}
              <circle
                className="drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]"
                cx="112"
                cy="112"
                fill="transparent"
                r="95"
                stroke="url(#neonGradient)"
                strokeDasharray="597"
                strokeDashoffset="180"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <defs>
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f2ff" />
                  <stop offset="100%" stopColor="#bc13fe" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center Text inside the circle */}
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-white italic">720</span>
              <span className="text-xs uppercase tracking-widest text-gray-400">Words Learned</span>
            </div>
          </div>
        </section>
        {/* END: Progress Section */}

        {/* BEGIN: Call to Action */}
        <section data-purpose="action-buttons">
          <button
            type="button"
            className="w-full py-5 glass-card flex items-center justify-center gap-3 bg-gradient-to-r from-[#00f2ff]/20 to-[#bc13fe]/20 border border-[#00f2ff]/40 shadow-[0_0_15px_#00f2ff,0_0_30px_#00f2ff] active:scale-95 transition-transform duration-200"
          >
            <span className="text-xl font-bold uppercase tracking-tighter text-white">Start Practice</span>
            <svg
              className="w-6 h-6 text-[#00f2ff]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </section>
        {/* END: Call to Action */}

        {/* BEGIN: Recent Performance */}
        <section className="space-y-4" data-purpose="stats-section">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-xl font-bold italic uppercase tracking-tight text-white">Recent Performance</h2>
            <span className="text-xs text-[#bc13fe] font-bold cursor-pointer">View History</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Accuracy Card */}
            <div className="glass-card p-4 flex flex-col gap-2">
              <span className="text-gray-400 text-xs font-semibold uppercase">Accuracy</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">94</span>
                <span className="text-[#00f2ff] font-bold text-sm">%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full mt-2">
                <div className="h-full bg-[#00f2ff] w-[94%] rounded-full shadow-[0_0_8px_#00f2ff]" />
              </div>
            </div>

            {/* Daily Streak Card */}
            <div className="glass-card p-4 flex flex-col gap-2">
              <span className="text-gray-400 text-xs font-semibold uppercase">Daily Streak</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">12</span>
                <span className="text-[#ff00bd] font-bold text-sm">Days</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 w-full bg-[#ff00bd] rounded-full opacity-30" />
                <div className="h-1.5 w-full bg-[#ff00bd] rounded-full opacity-60" />
                <div className="h-1.5 w-full bg-[#ff00bd] rounded-full shadow-[0_0_8px_#ff00bd]" />
              </div>
            </div>
          </div>

          {/* Recent Words List */}
          <div className="glass-card p-5 space-y-4" data-purpose="recent-words-list">
            {/* Word Item 1 */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#00f2ff]/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-[#00f2ff]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">Ephemeral</p>
                <p className="text-xs text-gray-500">Mastered 2 hours ago</p>
              </div>
              <span className="text-xs font-bold text-green-400 px-2 py-1 bg-green-400/10 rounded border border-green-400/20">
                +10 XP
              </span>
            </div>

            {/* Word Item 2 */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#bc13fe]/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-[#bc13fe]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">Magnanimous</p>
                <p className="text-xs text-gray-500">Mastered Yesterday</p>
              </div>
              <span className="text-xs font-bold text-green-400 px-2 py-1 bg-green-400/10 rounded border border-green-400/20">
                +10 XP
              </span>
            </div>
          </div>
        </section>
        {/* END: Recent Performance */}
      </main>

      {/* BEGIN: Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 p-4" data-purpose="bottom-navigation">
        <div className="glass-card flex justify-around items-center py-4 bg-black/40 border-t border-white/10">
          <button type="button" className="text-[#00f2ff]">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button type="button" className="text-gray-500">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button type="button" className="text-gray-500">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </nav>
      {/* END: Navigation Bar */}
    </div>
  );
}
