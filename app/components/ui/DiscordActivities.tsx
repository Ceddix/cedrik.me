"use client";

import React from "react";

import { useLanyardWS } from "use-lanyard";
import { discordId } from "@/app/components/Constants";
import CustomLink from "@/app/components/ui/CustomLink";
import { IoGameController } from "react-icons/io5";

export default function DiscordActivities() {
  const socket = useLanyardWS(discordId);
  const status = socket?.discord_status || "loading";
  const activities = socket?.activities || "loading";
  const spotify = socket?.spotify;

  const getAssetUrl = (applicationId: string | undefined, assetId: string | undefined): string => {
    if (!assetId) return "";

    if (assetId.startsWith("mp:external/")) {
      // Remove the prefix to get the original URL
      // ex: "mp:external/https://image.com/pic.png" -> "https://image.com/pic.png"
      const match = assetId.match(/(https?)\/(.*)/);
      if (match) {
        const rawUrl = `${match[1]}://${match[2]}`;
        return decodeURIComponent(rawUrl);
      }
    }
    // Handle Standard Discord Assets (default behavior)
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`;
  };

  return (
    <>
      {status != "offline" && status != "loading" && activities.length != 0 && (
        <div className={"w-full z-10 flex flex-col items-center"}>
          <div className={"fixed bottom-5 block"}>
            <ul className={"flex flex-row gap-2 items-center"}>
              {activities != "loading" &&
                activities?.map((activity, index) => (
                  <li
                    key={index}
                    className={
                      "rounded-full border-2 border-gray-300/30 bg-neutral-700/40 pl-1.5 py-1.5 shadow-md backdrop-blur-lg backdrop-saturate-150 w-56 hover:w-64 group ease-in duration-300 **:ease-in **:duration-300"
                    }
                  >
                    {(activity.name === "Spotify" && (
                      <CustomLink href={`https://open.spotify.com/track/${spotify?.track_id}`} className={"flex flex-row items-center gap-2"}>
                        <div className={"relative shrink-0"}>
                          <img
                            src={`${spotify?.album_art_url}`}
                            alt="Spotify Album Art"
                            className={
                              "size-12 group-hover:size-14 rounded-full border border-white/12.5 shadow-md animate-[spin_10s_linear_infinite]"
                            }
                          />
                          <img
                              src={`/vinyl-record.png`}
                              alt="Vinyl Record"
                              className={
                                "absolute top-0 size-12 group-hover:size-14 opacity-70 rounded-full shadow-md animate-[spin_10s_linear_infinite]"
                              }
                          />
                        </div>
                        <div className={"text-xs group-hover:text-[0.82rem] flex-1 [mask-image:linear-gradient(to_right,black_80%,transparent_92%)] break-all *:line-clamp-1"}>
                          <p className={"text-[0.6rem] group-hover:text-[0.67rem]"}>Listening to Spotify</p>
                          <p>
                            <b>{spotify?.song}</b>
                          </p>
                          <p>
                            {spotify?.artist}
                          </p>
                        </div>
                      </CustomLink>
                    )) || (
                      <div className={"flex flex-row items-center gap-2"}>
                        <div className={"relative shrink-0"}>
                          {activity.application_id && activity.assets?.large_image && (
                              <img
                                  src={getAssetUrl(activity.application_id, activity.assets?.large_image)}
                                  alt="Activity Image"
                                  className={
                                    "size-12 group-hover:size-14 rounded-full border border-white/10 shadow-md"
                                  }
                              />
                          ) || (
                              <IoGameController
                                  className={
                                    "size-12 group-hover:size-14 text-gray-300 shadow-md p-1"
                                  }
                              />
                          )}
                        </div>
                        <div className={"text-xs group-hover:text-[0.82rem] flex-1 [mask-image:linear-gradient(to_right,black_80%,transparent_92%)] break-all *:line-clamp-1"}>
                          <p>
                            Playing <b>{activity.name}</b>
                          </p>
                          <p>{activity.details}</p>
                          <p>{activity.state}</p>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
