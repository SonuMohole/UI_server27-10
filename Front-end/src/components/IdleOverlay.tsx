"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Bell, Sparkles, ArrowRight } from "lucide-react";

interface Notification {
  title: string;
  message: string;
  type: "offer" | "update" | "alert";
}

interface IdleOverlayProps {
  context?: "dashboard" | "assets" | "vulnerabilities" | "assistant";
}

export default function IdleOverlay({ context = "dashboard" }: IdleOverlayProps) {
  const [isIdle, setIsIdle] = useState(false);
  const [closing, setClosing] = useState(false); // ✨ For smooth close animation

  // 🔹 Notifications vary by context
  const notifications: Notification[] =
    context === "assets"
      ? [
          { title: "💾 New Asset Sync Available", message: "Scan your endpoints again to ensure inventory accuracy.", type: "update" },
          { title: "🎁 Try Smart Asset Correlation", message: "Get deep insight into connected endpoints and risk mapping.", type: "offer" },
        ]
      : context === "vulnerabilities"
      ? [
          { title: "⚠️ New CVE Alert", message: "CVE-2025-1079 detected in Apache HTTP Server 2.4.59.", type: "alert" },
          { title: "✨ Risk Reduction Insights", message: "Sentinel AI recommends patch prioritization by exposure score.", type: "update" },
        ]
      : [
          { title: "🎁 QStellar Premium Trial", message: "Unlock advanced analytics and priority scanning — free for 14 days.", type: "offer" },
          { title: "🔔 New Security Advisory", message: "Critical vulnerability (CVE-2025-1038) detected in Windows RPC layer.", type: "alert" },
          { title: "✨ AI Assistant Update", message: "Sentinel can now summarize advisories and generate patch reports.", type: "update" },
        ];

  // 🕒 Idle Detection (4s demo)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleIdle = () => setIsIdle(true);
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleIdle, 4000);
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, []);

  const handleClose = () => {
    // ✨ Trigger smooth slide-out animation
    setClosing(true);
    setTimeout(() => setIsIdle(false), 400);
  };

  if (!isIdle) return null;

  return (
    <>
      {/* Inline Animations */}
      <style>
        {`
          @keyframes slideInRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOutRight {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          .animate-slideInRight { animation: slideInRight 0.45s ease forwards; }
          .animate-slideOutRight { animation: slideOutRight 0.45s ease forwards; }
        `}
      </style>

      {/* Non-blurred overlay (transparent background removed) */}
      <div className="fixed inset-0 z-[90] flex justify-end pointer-events-none">
        {/* Right Sliding Panel */}
        <div
          className={`relative pointer-events-auto bg-[rgba(255,255,255,0.98)] shadow-2xl 
          w-full sm:w-[420px] h-screen p-6 border-l border-gray-200 flex flex-col 
          overflow-hidden ${closing ? "animate-slideOutRight" : "animate-slideInRight"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0E2762]" />
              <h2 className="text-xl font-semibold text-[#0E2762]">System Idle</h2>
            </div>

            {/* Read More Button */}
            <button
              onClick={handleClose}
              className="text-sm text-[#0E2762] font-medium hover:underline flex items-center gap-1 transition-all"
            >
              Read More <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            QStellar paused your dashboard due to inactivity.  
            While you’re here, explore new advisories and system updates.
          </p>

          {/* Notifications */}
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {notifications.map((note, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  note.type === "offer"
                    ? "bg-blue-50 border-blue-200"
                    : note.type === "alert"
                    ? "bg-red-50 border-red-200"
                    : "bg-emerald-50 border-emerald-200"
                } transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#0E2762] text-sm">{note.title}</h3>
                  {note.type === "offer" ? (
                    <Sparkles className="w-4 h-4 text-[#0E2762]" />
                  ) : note.type === "alert" ? (
                    <Bell className="w-4 h-4 text-red-500" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">{note.message}</p>

                {note.type === "offer" && (
                  <button className="mt-3 text-xs text-white bg-[#0E2762] px-3 py-1.5 rounded-md flex items-center gap-1 hover:scale-[1.02] transition-transform">
                    Explore <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-2 pt-5 border-t border-gray-200 mt-4">
            <ShieldCheck className="w-8 h-8 text-[#0E2762] animate-pulse" />
            <p className="text-xs text-gray-500 text-center">
              Monitoring continues in background.  
              All systems remain protected.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
