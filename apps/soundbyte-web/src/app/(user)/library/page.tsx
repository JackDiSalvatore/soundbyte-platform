"use client";

import useStreamingProvider from "@/hooks/use-streaming-provider";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import SpotifyWebApi from "spotify-web-api-node";
import { useEffect, useState } from "react";
import { env } from "@/lib/environment";
import TrackSearchResult from "@/components/track-search-results";
import Player from "@/components/player";

export default function Page() {
  return <main>content goes here...</main>;
}
