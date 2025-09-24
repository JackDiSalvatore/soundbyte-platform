"use client";

import SignIn from "@/components/sign-in";

import { redirect } from "next/navigation";

import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

export default function Page() {
  const { session, isPending } = useAuth();

  if (session) {
    redirect("/library");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex items-center space-x-3 mb-8"
      >
        <Music className="w-12 h-12 text-purple-500" />
        <h1 className="text-4xl font-extrabold tracking-wide">SoundByte</h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg text-gray-300 mb-12 text-center max-w-xl"
      >
        Stream your favorite tracks. Share your vibe. Connect with the world
        through music.
      </motion.p>

      {/* Sign In Button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <SignIn
          socialProvider="google"
          className="px-8 py-4 text-lg rounded-2xl shadow-lg bg-purple-600 hover:bg-purple-700 transition"
        />
      </motion.div>
    </div>
  );
}
