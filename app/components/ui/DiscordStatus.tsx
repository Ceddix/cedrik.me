"use client";

import { useLanyard } from "use-lanyard";
import { SITE_CONFIG } from "@/app/lib/config";
import clsx from "clsx";

export default function DiscordStatus() {
  const socket = useLanyard(SITE_CONFIG.discordId);
  const status = socket?.discord_status || "loading";

  return (
    <span className={"absolute flex size-4 bottom-2 right-8 transition duration-300 shadow-md"}>
      <span
        className={clsx(
          "absolute inline-flex h-full w-full opacity-75 rounded-full animate-[ping_3s_ease-out_infinite]",
          {
            ["bg-green-400"]: status === "online",
            ["bg-orange-400"]: status === "idle",
            ["bg-red-500"]: status === "dnd",
            ["bg-zinc-800 opacity-0!"]:
              status === "offline" || status === "loading",
          }
        )}
      />
      <span
        className={clsx(
          "relative inline-flex size-4 rounded-full",
          {
            ["bg-green-400"]: status === "online",
            ["bg-orange-400"]: status === "idle",
            ["bg-red-500"]: status === "dnd",
            ["bg-zinc-800 opacity-0"]:
              status === "offline" || status === "loading",
          }
        )}
      />
    </span>
  );
}
