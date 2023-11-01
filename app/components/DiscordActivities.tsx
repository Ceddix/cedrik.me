"use client";

import React from "react";

import { useLanyardWS } from "use-lanyard";
import { discordId } from "@/app/components/Constants";
import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function DiscordActivities() {
  const socket = useLanyardWS(discordId);
  const status = socket?.discord_status || "loading";
  const activities = socket?.activities || "loading";
  const spotify = socket?.spotify;

  return (
    <>
      {status != "offline" && status != "loading" && activities.length != 0 && (
        <div className={"w-100 z-10 flex flex-col items-center"}>
          <div className={"fixed bottom-4 block"}>
            <ul className={"flex flex-col"}>
              {activities != "loading" &&
                activities?.slice(0, 1).map((activity) => (
                  <li
                    className={
                      "flex flex-row items-center gap-3 rounded-full border border-white/[.125] bg-neutral-800/[.8] p-2 shadow-md backdrop-blur-lg backdrop-saturate-150"
                    }
                  >
                    {(activity.name === "Spotify" && (
                      <>
                        <div>
                          <img
                            src={`${spotify?.album_art_url}`}
                            alt="Spotify Album Art"
                            className={
                              "h-14 rounded-full border border-white/[.125] shadow-md"
                            }
                          />
                        </div>
                        <div className={"text-xs"}>
                          <p>Listening to</p>
                          <p>
                            <b>{spotify?.song}</b>
                          </p>
                          <p>
                            by <b>{spotify?.artist}</b>
                          </p>
                        </div>
                      </>
                    )) || (
                      <>
                        {activity.application_id &&
                          activity.assets?.large_image && (
                            <div className={"h-19"}>
                              <img
                                src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets?.large_image}.png`}
                                alt="Activity Image"
                                className={
                                  "h-14 rounded-full border border-white/[.1] shadow-md"
                                }
                              />
                            </div>
                          )}
                        <div className={"flex-auto text-xs"}>
                          <p>
                            Playing <b>{activity.name}</b>
                          </p>
                          <p>{activity.details}</p>
                          <p>{activity.state}</p>
                        </div>
                      </>
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
