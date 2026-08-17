"use client";

import { useLanyard } from "use-lanyard";
import { SITE_CONFIG } from "@/app/lib/config";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export default function DiscordStatus() {
  const socket = useLanyard(SITE_CONFIG.discordId);
  const status = socket?.discord_status;
  const isOnline = status === "online" || status === "idle" || status === "dnd";

  const getStatusColor = (s?: string) => {
    switch (s) {
      case "online":
        return "bg-green-400";
      case "idle":
        return "bg-orange-400";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-zinc-500";
    }
  };

  const getStatusLabel = (s?: string) => {
    switch (s) {
      case "online":
        return "Online";
      case "idle":
        return "Idle";
      case "dnd":
        return "Do Not Disturb";
      default:
        return "Offline";
    }
  };

  return (
    <AnimatePresence>
      {isOnline && (
        <motion.span
          key="discord-status-indicator"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className="absolute flex size-4 bottom-2 right-8"
          title={`Discord: ${getStatusLabel(status)}`}
          aria-label={`Discord status: ${getStatusLabel(status)}`}
        >
          {/* Ping ripple effect */}
          <span
            className={clsx(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-[ping_3s_ease-out_infinite] transition-colors duration-500 ease-in-out",
              getStatusColor(status)
            )}
          />
          {/* Core status badge dot */}
          <span
            className={clsx(
              "relative inline-flex size-4 rounded-full shadow-md transition-colors duration-500 ease-in-out",
              getStatusColor(status)
            )}
          />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

