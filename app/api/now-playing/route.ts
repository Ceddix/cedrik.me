import { NextResponse, connection } from "next/server";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  await connection();
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(SPOTIFY_NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 204 = nothing playing
    if (res.status === 204 || res.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const data = await res.json();

    if (!data.item) {
      return NextResponse.json({ isPlaying: false });
    }

    const track = data.item;

    return NextResponse.json({
      isPlaying: data.is_playing,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      album: track.album.name,
      albumArt: track.album.images?.[0]?.url || "",
      trackId: track.id,
      progress: data.progress_ms,
      duration: track.duration_ms,
    });
  } catch (error) {
    console.error("Spotify now-playing error:", error);
    return NextResponse.json({ isPlaying: false }, { status: 500 });
  }
}
