"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Bell, Sparkles, ArrowRight } from "lucide-react";

interface Notification {
  title: string;
  message: string;
  type: "offer" | "update" | "alert";
}

interface NotificationPanelProps {
  onClose: () => void;
  autoOpened?: boolean;
}

export default function NotificationPanel({
  onClose,
  autoOpened = false,
}: NotificationPanelProps) {
  const [closing, setClosing] = useState(false);

  const notifications: Notification[] = [
    {
      title: "🎁 QStellar Premium Trial",
      message:
        "Unlock advanced analytics and threat correlation for free — 14 days trial.",
      type: "offer",
    },
    {
      title: "⚠️ New CVE Alert",
      message:
        "CVE-2025-1130 detected in Linux Kernel 6.5. Patch now to stay secure.",
      type: "alert",
    },
    {
      title: "✨ Assistant Update",
      message:
        "Sentinel AI now summarizes advisories and risk reports automatically.",
      type: "update",
    },
  ];

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 400); // smooth slide-out
  };

  useEffect(() => {
    if (!autoOpened) return;

    const handleActivity = () => handleClose();
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, handleActivity));
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
    };
  }, [autoOpened]);

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeInOverlay {
          from { background-color: rgba(0,0,0,0); }
          to { background-color: rgba(0,0,0,0.3); }
        }
        @keyframes fadeOutOverlay {
          from { background-color: rgba(0,0,0,0.3); }
          to { background-color: rgba(0,0,0,0); }
        }
      `}</style>

      {/* Background overlay */}
      <div
        className={`fixed inset-0 z-[90] flex justify-end transition-all duration-300 
          ${
            closing
              ? "animate-[fadeOutOverlay_0.4s_ease_forwards]"
              : "animate-[fadeInOverlay_0.3s_ease_forwards]"
          } bg-black/30`}
      >
        {/* Transparent glass-like panel */}
        <div
          className={`w-full sm:w-[420px] h-screen shadow-2xl border-l border-white/30 
            bg-white/50 dark:bg-[#0b0f17]/60 backdrop-opacity-70
            ${
              closing
                ? "animate-[slideOutRight_0.4s_ease_forwards]"
                : "animate-[slideInRight_0.4s_ease_forwards]"
            } transition-all duration-300 p-6`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0E2762]" />
              <h2 className="text-xl font-semibold text-[#0E2762]">
                Security Notifications
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-sm text-[#0E2762] hover:underline"
            >
              Close
            </button>
          </div>

          {/* Notification List */}
          <div className="space-y-4 overflow-y-auto h-[80vh] pr-2">
            {notifications.map((note, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border transition-all duration-300 shadow-sm
                  ${
                    note.type === "offer"
                      ? "bg-blue-50 border-blue-200"
                      : note.type === "alert"
                      ? "bg-red-50 border-red-200"
                      : "bg-emerald-50 border-emerald-200"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#0E2762] text-sm">
                    {note.title}
                  </h3>
                  {note.type === "offer" ? (
                    <Sparkles className="w-4 h-4 text-[#0E2762]" />
                  ) : note.type === "alert" ? (
                    <Bell className="w-4 h-4 text-red-500" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">{note.message}</p>
                <button className="mt-3 text-xs text-[#0E2762] flex items-center gap-1 hover:underline">
                  Read more <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-4 border-t pt-4 border-white/30">
            <ShieldCheck className="inline-block w-5 h-5 mr-1 text-[#0E2762]" />
            QStellar continuously monitors and updates your security landscape.
          </div>
        </div>
      </div>
    </>
  );
}
