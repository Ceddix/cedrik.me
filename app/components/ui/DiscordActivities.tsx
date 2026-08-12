"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLanyard } from "use-lanyard";
import { SITE_CONFIG } from "@/app/lib/config";
import { IoGameController } from "react-icons/io5";
import { TbBrandSpotify } from "react-icons/tb";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import clsx from "clsx";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SpotifyFallback {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  trackId: string;
  progress: number;
  duration: number;
  fetchedAt?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Replace semicolons with commas and & for the last artist */
function formatArtists(raw: string | undefined): string {
  if (!raw) return "";
  const artists = raw.split("; ").filter(Boolean);
  if (artists.length <= 1) return raw;
  if (artists.length === 2) return `${artists[0]} & ${artists[1]}`;
  return `${artists.slice(0, -1).join(", ")} & ${artists[artists.length - 1]}`;
}

/** Format elapsed ms into a human-readable "Xh Ym" / "Xm" / "Xs" string */
function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

/** Format ms into mm:ss */
function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// ─── Click-outside hook ──────────────────────────────────────────────────────

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  cb: () => void
) {
  useEffect(() => {
    const handler = (e: any) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      cb();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [ref, cb]);
}

// ─── Scrolling text component ────────────────────────────────────────────────

function ScrollingText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    setOverflows(textEl.offsetWidth > container.offsetWidth);
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "overflow-hidden",
        overflows
          ? "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
          : "[mask-image:linear-gradient(to_right,black,black_85%,transparent)]"
      )}
    >
      <span
        ref={textRef}
        className={clsx(
          "inline-block whitespace-nowrap",
          overflows && "animate-[marquee_10s_linear_infinite]",
          className
        )}
      >
        {text}
        {overflows && (
          <>
            <span className="mx-4 opacity-40">·</span>
            {text}
          </>
        )}
      </span>
    </div>
  );
}

// ─── Spotify progress hook ───────────────────────────────────────────────────

function useSpotifyProgress(
  start?: number,
  end?: number,
  apiProgress?: number,
  apiDuration?: number,
  fetchedAt?: number
) {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const hasLanyard = start != null && end != null;
    const hasApi = apiProgress != null && apiDuration != null && apiDuration > 0;

    if (!hasLanyard && !hasApi) {
      setProgress(0);
      return;
    }

    const initialTime = fetchedAt || Date.now();

    const tick = () => {
      if (hasLanyard) {
        const now = Date.now();
        const elapsed = now - start!;
        const duration = end! - start!;
        setProgress(duration > 0 ? Math.min(elapsed / duration, 1) : 0);
      } else if (hasApi) {
        const now = Date.now();
        const elapsedSinceFetch = now - initialTime;
        const currentMs = apiProgress! + elapsedSinceFetch;
        setProgress(Math.min(currentMs / apiDuration!, 1));
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [start, end, apiProgress, apiDuration, fetchedAt]);

  return progress;
}

// ─── Elapsed time hook ───────────────────────────────────────────────────────

function useElapsedTime(startTimestamp?: number) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!startTimestamp) {
      setElapsed("");
      return;
    }

    const update = () =>
      setElapsed(formatElapsed(Date.now() - startTimestamp));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTimestamp]);

  return elapsed;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SpotifyCard({
  song,
  artist,
  albumArt,
  trackId,
  timestampStart,
  timestampEnd,
  apiProgress,
  apiDuration,
  fetchedAt,
}: {
  song: string;
  artist: string;
  albumArt?: string;
  trackId?: string;
  timestampStart?: number;
  timestampEnd?: number;
  apiProgress?: number;
  apiDuration?: number;
  fetchedAt?: number;
}) {
  const progress = useSpotifyProgress(
    timestampStart,
    timestampEnd,
    apiProgress,
    apiDuration,
    fetchedAt
  );

  const duration = timestampEnd && timestampStart
    ? timestampEnd - timestampStart
    : apiDuration || 0;
  const currentMs = progress * duration;

  const spotifyUrl = trackId
    ? `https://open.spotify.com/track/${trackId}`
    : undefined;

  return (
    <div className="flex flex-row items-center gap-2.5 w-full h-full">
      {/* Album art with vinyl overlay */}
      <div className="relative shrink-0">
        <img
          src={albumArt || undefined}
          alt="Album art"
          className="size-12 rounded-full border border-white/12.5 shadow-md animate-[spin_10s_linear_infinite]"
        />
        <img
          src="/vinyl-record.png"
          alt=""
          className="absolute top-0 size-12 opacity-70 rounded-full animate-[spin_10s_linear_infinite]"
        />
      </div>

      {/* Track info + progress */}
      <div className="text-xs flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-[0.6rem] text-neutral-400 truncate">
          Listening to
        </p>
        <ScrollingText
          text={song}
          className="text-white text-xs font-bold"
        />
        <ScrollingText
          text={formatArtists(artist)}
          className="text-gray-300 text-[0.65rem]"
        />
        {/* Progress bar */}
        <div className="flex items-center gap-1.5 mt-0.5 pr-1">
          <span className="text-[0.5rem] text-gray-500 tabular-nums shrink-0">
            {formatTime(currentMs)}
          </span>
          <div className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1DB954] to-[#1ed760]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[0.5rem] text-gray-500 tabular-nums shrink-0">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Open in Spotify link */}
      {spotifyUrl && (
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 p-1 rounded-full text-[#1DB954] hover:bg-[#1DB954]/15 transition-colors duration-200"
          title="Open in Spotify"
        >
          <TbBrandSpotify className="size-4" />
        </a>
      )}
    </div>
  );
}

function GameCard({
  activity,
  getAssetUrl,
}: {
  activity: any;
  getAssetUrl: (appId?: string, assetId?: string) => string;
}) {
  const elapsed = useElapsedTime(activity.timestamps?.start);

  const details = activity.details;
  const state = activity.state;

  return (
    <div className="flex flex-row items-center gap-2.5 w-full h-full">
      {/* Game icon */}
      <div className="relative shrink-0">
        {activity.application_id && activity.assets?.large_image ? (
          <>
            <img
              src={getAssetUrl(
                activity.application_id,
                activity.assets?.large_image
              )}
              alt={activity.name}
              className="size-12 rounded-full border border-white/12.5 shadow-md"
            />
            {activity.assets?.small_image && (
              <img
                src={getAssetUrl(
                  activity.application_id,
                  activity.assets.small_image
                )}
                alt=""
                className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full border-2 border-neutral-800 shadow-md"
              />
            )}
          </>
        ) : (
          <div className="size-12 rounded-full border border-white/12.5 bg-neutral-800/80 shadow-md flex items-center justify-center shrink-0">
            <IoGameController className="size-6 text-gray-200" />
          </div>
        )}
      </div>

      {/* Game info */}
      <div className="text-xs flex-1 min-w-0 [mask-image:linear-gradient(to_right,black,black_85%,transparent)]">
        <p className="text-[0.6rem] text-neutral-400 truncate">
          Playing
        </p>
        <p className="text-white truncate">
          <b>{activity.name}</b>
        </p>
        <p className="text-gray-300 text-[0.65rem] truncate">
          {details || state || (elapsed ? `for ${elapsed}` : "Active")}
        </p>
        {(details || state) && elapsed && (
          <p className="text-gray-500 text-[0.55rem] truncate">
            for {elapsed}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function DiscordActivities() {
  const socket = useLanyard(SITE_CONFIG.discordId);
  const status = socket?.discord_status || "loading";
  const activitiesRaw = socket?.activities || [];
  const lanyardSpotify = socket?.spotify;

  const [activities, setActivities] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [spotifyFallback, setSpotifyFallback] =
    useState<SpotifyFallback | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setExpanded(false));

  // ── Spotify API fallback polling ──
  const fetchSpotify = useCallback(async () => {
    try {
      const res = await fetch("/api/now-playing");
      const data: SpotifyFallback = await res.json();
      if (data.isPlaying) {
        data.fetchedAt = Date.now();
        setSpotifyFallback(data);
      } else {
        setSpotifyFallback(null);
      }
    } catch {
      setSpotifyFallback(null);
    }
  }, []);

  useEffect(() => {
    if (lanyardSpotify) {
      setSpotifyFallback(null);
      return;
    }

    fetchSpotify();
    const interval = setInterval(fetchSpotify, 10_000);
    return () => clearInterval(interval);
  }, [lanyardSpotify, fetchSpotify]);

  // ── Build activity list ──
  useEffect(() => {
    const list: any[] = [];

    if (lanyardSpotify) {
      list.push({
        _type: "spotify",
        _source: "lanyard",
        name: "Spotify",
        song: lanyardSpotify.song,
        artist: lanyardSpotify.artist,
        album: lanyardSpotify.album,
        albumArt: lanyardSpotify.album_art_url,
        trackId: lanyardSpotify.track_id,
        timestampStart: lanyardSpotify.timestamps?.start,
        timestampEnd: lanyardSpotify.timestamps?.end,
      });
    } else if (spotifyFallback) {
      list.push({
        _type: "spotify",
        _source: "api",
        name: "Spotify",
        song: spotifyFallback.title,
        artist: spotifyFallback.artist,
        album: spotifyFallback.album,
        albumArt: spotifyFallback.albumArt,
        trackId: spotifyFallback.trackId,
        apiProgress: spotifyFallback.progress,
        apiDuration: spotifyFallback.duration,
        fetchedAt: spotifyFallback.fetchedAt,
      });
    }

    if (activitiesRaw && Array.isArray(activitiesRaw)) {
      for (const activity of activitiesRaw) {
        if (activity.name === "Spotify" || activity.type === 4) continue;
        list.push({ ...activity, _type: "game" });
      }
    }

    setActivities(list);
  }, [activitiesRaw, lanyardSpotify, spotifyFallback]);

  const getAssetUrl = (applicationId?: string, assetId?: string) => {
    if (!assetId) return "";
    if (assetId.startsWith("mp:external/")) {
      // Remove the prefix to get the original URL
      // ex: "mp:external/https://image.com/pic.png" -> "https://image.com/pic.png"
      const match = assetId.match(/(https?)\/(.*)/);
      if (match) {
        return decodeURIComponent(`${match[1]}://${match[2]}`);
      }
    }
    // Handle standard Discord assets (default behavior)
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`;
  };

  const selectActivity = (activity: any) => {
    const reordered = [
      activity,
      ...activities.filter((a) => a !== activity),
    ];
    setActivities(reordered);
    setExpanded(false);
  };

  if (activities.length === 0) return null;

  return (
    <LayoutGroup>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[240px]"
      >
        <div
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          onClick={() => setExpanded((p) => !p)}
          className="relative cursor-pointer"
        >
          <div
            className={clsx(
              "flex flex-col-reverse items-center",
              expanded && "gap-2.5"
            )}
          >
            <AnimatePresence initial={false}>
              {activities.map((activity, index) => {
                const isSpotify = activity._type === "spotify";
                const key = isSpotify
                  ? "spotify"
                  : activity.id ||
                  activity.session_id ||
                  `${activity.name}-${activity.application_id || index}`;

                const isStacked = !expanded && index !== 0;

                return (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      scale: expanded ? 1 : 1 - index * 0.04,
                      y: expanded ? 0 : -index * 10,
                      zIndex: 50 - index,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                    }}
                    className={clsx(
                      "w-full",
                      isStacked && "absolute bottom-0"
                    )}
                    // Mask stacked background cards: only show the top peek
                    style={
                      isStacked
                        ? {
                          maskImage:
                            "linear-gradient(to bottom, black 10px, transparent 20px)",
                          WebkitMaskImage:
                            "linear-gradient(to bottom, black 10px, transparent 20px)",
                        }
                        : undefined
                    }
                  >
                    <motion.li
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectActivity(activity);
                      }}
                      className={
                        "list-none rounded-3xl border-2 border-gray-300/30 bg-neutral-700/40 pl-1.5 py-1.5 pr-3 shadow-lg w-full h-[72px] flex items-center overflow-hidden transition duration-200 ease-in-out hover:bg-neutral-600/60"
                      }
                    >
                      <div
                        className={clsx(
                          "flex flex-row items-center gap-2.5 w-full h-full transition-opacity duration-200",
                          isStacked && "opacity-0"
                        )}
                      >
                        {isSpotify ? (
                          <SpotifyCard
                            song={activity.song}
                            artist={activity.artist}
                            albumArt={activity.albumArt}
                            trackId={activity.trackId}
                            timestampStart={activity.timestampStart}
                            timestampEnd={activity.timestampEnd}
                            apiProgress={activity.apiProgress}
                            apiDuration={activity.apiDuration}
                            fetchedAt={activity.fetchedAt}
                          />
                        ) : (
                          <GameCard
                            activity={activity}
                            getAssetUrl={getAssetUrl}
                          />
                        )}
                      </div>
                    </motion.li>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </LayoutGroup>
  );
}