"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanyard } from "use-lanyard";
import { SITE_CONFIG } from "@/app/lib/config";
import { IoGameController } from "react-icons/io5";
import { TbBrandSpotify, TbBrandDiscord } from "react-icons/tb";
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

/** Generate a stable key for an activity */
function getActivityKey(activity: any, index: number): string {
  if (activity._type === "spotify") return "spotify";
  if (activity._type === "status") return "custom-status";
  return (
    activity.id ||
    activity.session_id ||
    `${activity.name}-${activity.application_id || index}`
  );
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

const SCROLL_SPEED = 25; // pixels per second
const PAUSE_DURATION = 3000; // ms to pause at start/end
const GAP_WIDTH = 40; // px gap between repeated text

function ScrollingText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [offset, setOffset] = useState(0);
  const animRef = useRef<number>(0);
  const phaseRef = useRef<"pause-start" | "scrolling" | "pause-end">("pause-start");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTimeRef = useRef<number>(0);
  // Store the scroll distance so it doesn't change mid-animation
  const scrollDistRef = useRef(0);

  // Measure overflow using a hidden measurement span (single copy of text)
  useEffect(() => {
    const container = containerRef.current;
    const measureEl = measureRef.current;
    if (!container || !measureEl) return;
    const textWidth = measureEl.offsetWidth;
    const containerWidth = container.offsetWidth;
    const doesOverflow = textWidth > containerWidth;
    setOverflows(doesOverflow);
    setOffset(0);
    phaseRef.current = "pause-start";
    // Distance to scroll = single text width + gap
    scrollDistRef.current = textWidth + GAP_WIDTH;
  }, [text]);

  // Animation loop — runs forever while overflows is true
  useEffect(() => {
    if (!overflows) return;

    const startPause = () => {
      phaseRef.current = "pause-start";
      setOffset(0);
      timerRef.current = setTimeout(() => {
        phaseRef.current = "scrolling";
        lastTimeRef.current = performance.now();
        animRef.current = requestAnimationFrame(tick);
      }, PAUSE_DURATION);
    };

    const tick = (now: number) => {
      if (phaseRef.current !== "scrolling") return;

      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      const totalScroll = scrollDistRef.current;

      setOffset((prev) => {
        const next = prev + (SCROLL_SPEED * dt) / 1000;
        if (next >= totalScroll) {
          // Seamlessly loop: pause then restart
          phaseRef.current = "pause-end";
          timerRef.current = setTimeout(startPause, PAUSE_DURATION);
          return 0;
        }
        return next;
      });

      if (phaseRef.current === "scrolling") {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    startPause();

    return () => {
      cancelAnimationFrame(animRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [overflows, text]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "overflow-hidden",
        overflows
          ? "[mask-image:linear-gradient(to_right,black_0%,black_94%,transparent)]"
          : "[mask-image:linear-gradient(to_right,black,black_85%,transparent)]"
      )}
    >
      {/* Hidden measurement span — single copy, not affected by duplication */}
      <span
        ref={measureRef}
        className={clsx("inline-block whitespace-nowrap invisible absolute", className)}
        aria-hidden
      >
        {text}
      </span>
      <span
        className={clsx("inline-block whitespace-nowrap", className)}
        style={
          overflows
            ? { transform: `translateX(-${offset}px)` }
            : undefined
        }
      >
        {text}
        {overflows && (
          <>
            <span style={{ display: "inline-block", width: GAP_WIDTH }} />
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
          <span className="text-[0.55rem] font-mono text-gray-400 tabular-nums shrink-0 min-w-[2.2em] text-right">
            {formatTime(currentMs)}
          </span>
          <div className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1DB954] to-[#1ed760]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[0.55rem] font-mono text-gray-400 tabular-nums shrink-0 min-w-[2.2em]">
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

  // Determine if we have a renderable large image
  // Check for large_image regardless of application_id
  const hasLargeImage = !!activity.assets?.large_image;
  const largeImageUrl = hasLargeImage
    ? getAssetUrl(activity.application_id, activity.assets.large_image)
    : "";

  return (
    <div className="flex flex-row items-center gap-2.5 w-full h-full">
      {/* Game icon */}
      <div className="relative shrink-0">
        {hasLargeImage && largeImageUrl ? (
          <>
            <img
              src={largeImageUrl}
              alt={activity.name}
              className="size-12 rounded-full border border-white/12.5 shadow-md object-cover"
            />
            {activity.assets?.small_image && (
              <img
                src={getAssetUrl(
                  activity.application_id,
                  activity.assets.small_image
                )}
                alt=""
                className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full border-2 border-neutral-800 shadow-md object-cover"
              />
            )}
          </>
        ) : (
          <div className="size-12 rounded-full border border-white/12.5 bg-neutral-800/80 shadow-md flex items-center justify-center shrink-0">
            <IoGameController className="size-6 text-gray-200" />
          </div>
        )}
      </div>

      {/* Game info — use ScrollingText for overflow */}
      <div className="text-xs flex-1 min-w-0">
        <p className="text-[0.6rem] text-neutral-400 truncate">
          Playing
        </p>
        <ScrollingText
          text={activity.name}
          className="text-white text-xs font-bold"
        />
        {(details || state) && (
          <ScrollingText
            text={details || state}
            className="text-gray-300 text-[0.65rem]"
          />
        )}
        {!(details || state) && elapsed && (
          <p className="text-gray-300 text-[0.65rem] truncate">
            for {elapsed}
          </p>
        )}
        {(details || state) && elapsed && (
          <p className="text-gray-500 text-[0.55rem] truncate">
            for {elapsed}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusCard({ activity }: { activity: any }) {
  const emoji = activity.emoji;
  const state = activity.state;
  const customEmojiUrl = emoji?.id
    ? `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "webp"}?size=64&quality=lossless`
    : null;

  return (
    <div className="flex flex-row items-center gap-2.5 w-full h-full">
      {/* Icon / Emoji */}
      <div className="size-12 rounded-full border border-white/12.5 bg-neutral-800/80 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
        {customEmojiUrl ? (
          <img
            src={customEmojiUrl}
            alt={emoji?.name || "status emoji"}
            className="size-7 object-contain"
          />
        ) : emoji?.name ? (
          <span className="text-2xl select-none leading-none">
            {emoji.name}
          </span>
        ) : (
          <TbBrandDiscord className="size-6 text-[#5865F2]" />
        )}
      </div>

      {/* Info */}
      <div className="text-xs flex-1 min-w-0 flex flex-col justify-center py-0.5">
        <p className="text-[0.6rem] text-neutral-400 truncate leading-tight">
          Discord Status
        </p>
        <p
          className="text-white text-xs font-semibold leading-snug line-clamp-2 break-words"
          title={state || "Active"}
        >
          {state || "Active"}
        </p>
      </div>

      {/* Discord link */}
      {SITE_CONFIG.socials.discord && (
        <a
          href={SITE_CONFIG.socials.discord}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 p-1 rounded-full text-[#5865F2] hover:bg-[#5865F2]/15 transition-colors duration-200"
          title="Open Discord Profile"
        >
          <TbBrandDiscord className="size-4" />
        </a>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function DiscordActivities() {
  const socket = useLanyard(SITE_CONFIG.discordId);
  const status = socket?.discord_status || "loading";
  const activitiesRaw = socket?.activities || [];
  const lanyardSpotify = socket?.spotify;

  const isDiscordOnline =
    status === "online" || status === "idle" || status === "dnd";

  const [expanded, setExpanded] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [spotifyFallback, setSpotifyFallback] =
    useState<SpotifyFallback | null>(null);
  const [ready, setReady] = useState(false);

  // Cache latest Lanyard Spotify track data to bridge offline transitions seamlessly
  const cachedSpotifyRef = useRef<SpotifyFallback | null>(null);

  if (lanyardSpotify) {
    const start = lanyardSpotify.timestamps?.start;
    const end = lanyardSpotify.timestamps?.end;
    cachedSpotifyRef.current = {
      isPlaying: true,
      title: lanyardSpotify.song || "",
      artist: lanyardSpotify.artist || "",
      album: lanyardSpotify.album || "",
      albumArt: lanyardSpotify.album_art_url || "",
      trackId: lanyardSpotify.track_id || "",
      progress: start ? Math.max(0, Date.now() - start) : 0,
      duration: start && end ? Math.max(0, end - start) : 0,
      fetchedAt: Date.now(),
    };
  } else if (isDiscordOnline) {
    // If user is online on Discord and not playing Spotify, clear the cache immediately
    cachedSpotifyRef.current = null;
  }

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setExpanded(false));

  // ── Delay showing until social links have animated (first load only) ──
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  // ── Spotify API fallback polling ──
  const fetchSpotify = useCallback(async () => {
    try {
      const res = await fetch("/api/now-playing");
      const data: SpotifyFallback = await res.json();
      if (data.isPlaying) {
        data.fetchedAt = Date.now();
        setSpotifyFallback(data);
        cachedSpotifyRef.current = data;
      } else {
        setSpotifyFallback(null);
        cachedSpotifyRef.current = null;
      }
    } catch {
      setSpotifyFallback(null);
      cachedSpotifyRef.current = null;
    }
  }, []);

  useEffect(() => {
    // If Discord is online, Lanyard WebSocket handles Spotify in real-time
    if (isDiscordOnline) {
      setSpotifyFallback(null);
      return;
    }

    // Discord is offline: poll Spotify API
    fetchSpotify();
    const interval = setInterval(fetchSpotify, 10_000);
    return () => clearInterval(interval);
  }, [isDiscordOnline, fetchSpotify]);

  // ── Synchronously derive activity list (preserving user selection) ──
  // Priority: 1. Discord Status -> 2. Spotify -> 3. Everything else
  const activities = useMemo(() => {
    const list: any[] = [];

    // 1. Discord Status (Priority #1)
    if (isDiscordOnline && activitiesRaw && Array.isArray(activitiesRaw)) {
      const customActivity = activitiesRaw.find(
        (a) => a.type === 4 || a.id === "custom"
      );
      if (customActivity && (customActivity.state || customActivity.emoji)) {
        list.push({ ...customActivity, _type: "status" });
      }
    }

    // 2. Spotify (Priority #2)
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
    } else if (!isDiscordOnline && (spotifyFallback || cachedSpotifyRef.current)) {
      const activeFallback = spotifyFallback || cachedSpotifyRef.current!;
      list.push({
        _type: "spotify",
        _source: "api",
        name: "Spotify",
        song: activeFallback.title,
        artist: activeFallback.artist,
        album: activeFallback.album,
        albumArt: activeFallback.albumArt,
        trackId: activeFallback.trackId,
        apiProgress: activeFallback.progress,
        apiDuration: activeFallback.duration,
        fetchedAt: activeFallback.fetchedAt,
      });
    }

    // 3. Everything else / Games (Priority #3)
    if (activitiesRaw && Array.isArray(activitiesRaw)) {
      for (const activity of activitiesRaw) {
        if (
          activity.name === "Spotify" ||
          activity.type === 4 ||
          activity.id === "custom"
        )
          continue;
        list.push({ ...activity, _type: "game" });
      }
    }

    // Preserve user's selected activity at the front
    if (selectedKey) {
      const selectedIdx = list.findIndex(
        (a, i) => getActivityKey(a, i) === selectedKey
      );
      if (selectedIdx > 0) {
        const [selected] = list.splice(selectedIdx, 1);
        list.unshift(selected);
      }
    }

    return list;
  }, [lanyardSpotify, isDiscordOnline, spotifyFallback, activitiesRaw, selectedKey]);

  const [introPeek, setIntroPeek] = useState(false);
  const bouncedRef = useRef(false);
  const touchStartY = useRef<number | null>(null);

  // Trigger a brief peek bounce on initial load when multiple activities exist
  useEffect(() => {
    if (ready && activities.length > 1 && !bouncedRef.current) {
      bouncedRef.current = true;
      const t1 = setTimeout(() => setIntroPeek(true), 500);
      const t2 = setTimeout(() => setIntroPeek(false), 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [ready, activities.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;
    touchStartY.current = null;

    // Swipe up (deltaY < -20) -> expand activities stack
    if (deltaY < -20 && activities.length > 1) {
      setExpanded(true);
    }
    // Swipe down (deltaY > 20) -> collapse activities stack
    else if (deltaY > 20) {
      setExpanded(false);
    }
  };

  const getAssetUrl = (applicationId?: string, assetId?: string) => {
    if (!assetId) return "";
    if (assetId.startsWith("mp:external/")) {
      // Remove the prefix to get the original URL
      // ex: "mp:external/https/image.com/pic.png" -> "https://image.com/pic.png"
      const match = assetId.match(/mp:external\/(https?)\/(.*)/);
      if (match) {
        return decodeURIComponent(`${match[1]}://${match[2]}`);
      }
    }
    // Handle standard Discord assets (default behavior)
    if (applicationId) {
      return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`;
    }
    return "";
  };

  const selectActivity = (activity: any, index: number) => {
    const key = getActivityKey(activity, index);
    setSelectedKey(key);
    setExpanded(false);
  };

  if (!ready) return null;

  return (
    <AnimatePresence>
      {activities.length > 0 && (
        <LayoutGroup>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[240px]"
          >
            <div
              onMouseEnter={() => setExpanded(true)}
              onMouseLeave={() => setExpanded(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative"
            >
              <div
                className={clsx(
                  "flex flex-col-reverse items-center",
                  expanded && "gap-2.5"
                )}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {activities.map((activity, index) => {
                    const isSpotify = activity._type === "spotify";
                    const isStatus = activity._type === "status";
                    const key = getActivityKey(activity, index);
                    const isTop = index === 0;
                    const isStacked = !expanded && !isTop;

                    return (
                      <motion.div
                        key={key}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          scale: expanded ? 1 : 1 - index * 0.04,
                          y: expanded
                            ? 0
                            : introPeek
                            ? -index * 22
                            : -index * 11,
                          zIndex: 50 - index,
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className={clsx(
                          "w-full",
                          isStacked && "absolute bottom-0"
                        )}
                        // Soft gradient mask: clean top peek with gentle taper to hide borders inside top card
                        style={
                          isStacked
                            ? {
                              maskImage:
                                "linear-gradient(to bottom, black 0px, black 8px, rgba(0,0,0,0.4) 16px, transparent 28px)",
                              WebkitMaskImage:
                                "linear-gradient(to bottom, black 0px, black 8px, rgba(0,0,0,0.4) 16px, transparent 28px)",
                            }
                            : undefined
                        }
                      >
                        <motion.li
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isTop) {
                              // Top card: toggle expand/collapse
                              setExpanded((p) => !p);
                            } else {
                              // Background card: select this activity
                              selectActivity(activity, index);
                            }
                          }}
                          className={clsx(
                            "list-none rounded-3xl border-2 border-gray-300/30 bg-neutral-700/40 pl-1.5 py-1.5 pr-3 shadow-lg w-full h-[72px] flex items-center overflow-hidden transition duration-200 ease-in-out hover:bg-neutral-600/60",
                            isTop ? "cursor-pointer" : "cursor-pointer"
                          )}
                        >
                          <motion.div
                            animate={{ opacity: expanded || isTop ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-row items-center gap-2.5 w-full h-full"
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
                            ) : isStatus ? (
                              <StatusCard activity={activity} />
                            ) : (
                              <GameCard
                                activity={activity}
                                getAssetUrl={getAssetUrl}
                              />
                            )}
                          </motion.div>
                        </motion.li>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </LayoutGroup>
      )}
    </AnimatePresence>
  );
}