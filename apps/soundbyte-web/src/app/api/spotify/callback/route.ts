// Code moved to backend.
// Redirect url is on the frontend and will call the backend to covert the code into an access token

/*
import { CreateProviderCredentialsDto } from "@/dto/create-provider-credentials-dto";
import { auth } from "@/lib/auth";
import axios from "axios";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  // (Optional) Get user session — if you're using Better-Auth
  // This depends on how Better-Auth exposes sessions (e.g., via cookies or headers)
  const session = await auth.api.getSession(req);

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.SPOTIFY_REDIRECT_URL!);
  params.append("client_id", process.env.SPOTIFY_CLIENT_ID!);
  params.append("client_secret", process.env.SPOTIFY_CLIENT_SECRET!);

  // Convert code to token
  const spotifyRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await spotifyRes.json(); // TODO: validate data

  if (!spotifyRes.ok) {
    console.error("Failed to get Spotify token", data);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }

  const userConnectSpotifyPayload = CreateProviderCredentialsDto.parse({
    userId: session?.user.id,
    provider: "spotify",
    token: data,
  });

  console.log(`Sending to SoundByte Streaming Integration API...`);
  console.log(`payload: ${JSON.stringify(userConnectSpotifyPayload, null, 2)}`);

  // Send to backend
  // Save access_token, refresh_token, expires_in, etc. to your database
  // Link it to the current user session

  const integrationRes = await axios.post(
    `${process.env.STREAMING_API!}/connect`,
    userConnectSpotifyPayload
  );

  console.log(
    `integrationRes: ${JSON.stringify(integrationRes.data, null, 2)}`
  );

  redirect("/library");

  // For debugging or dev:
  return NextResponse.json({ token: data });
}
*/
