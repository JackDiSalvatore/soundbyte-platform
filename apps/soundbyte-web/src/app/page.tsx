"use client";

import SignIn from "@/components/sign-in";

import { redirect } from "next/navigation";

import { motion, Variants } from "framer-motion";
import { CheckCircle, Mic, Music, Play, Radio, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useState, useEffect } from "react";

export default function Page() {
  const { session, isPending } = useAuth();

  if (session) {
    redirect("/library");
  }
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 text-gray-900">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(249,115,22,0.08)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.06)_0%,transparent_50%)]"></div>
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="relative">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <Music className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              SoundByte
            </h1>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Professional Artist Profiles
          </h2>
          <div className="text-2xl md:text-3xl text-orange-600 font-semibold mb-8">
            Powered by SoundCloud
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed">
            Create stunning artist profiles, showcase your music catalog, and
            connect with the rising music community.
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Transform your SoundCloud presence into a professional platform that
            drives engagement and grows your audience.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center my-12"
        >
          <SignIn
            socialProvider="google"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-10 py-4 rounded-xl shadow-lg transition-all duration-300 text-lg"
          />
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: <Play className="w-7 h-7" />,
              title: "Seamless Streaming",
              description:
                "Integrate your entire SoundCloud library with professional playback controls and curated playlists.",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: <Mic className="w-7 h-7" />,
              title: "Artist Promotion",
              description:
                "Professional profile pages with advanced analytics, fan engagement tools, and promotional features.",
              color: "from-orange-500 to-orange-600",
            },
            {
              icon: <TrendingUp className="w-7 h-7" />,
              title: "Network Growth",
              description:
                "Discover and collaborate with emerging artists. Build meaningful connections in the music industry.",
              color: "from-green-500 to-green-600",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="group cursor-default"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 h-full hover:shadow-xl transition-shadow duration-300">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SoundByte?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for serious artists who want to elevate their
              online presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Professional artist profile customization",
              "Advanced music analytics and insights",
              "Fan engagement and communication tools",
              "Seamless SoundCloud integration",
              "Mobile-optimized responsive design",
              "Community discovery and networking",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-8 mb-16 text-center"
        >
          {[
            {
              number: "Unlimited",
              label: "Track Integration",
              sublabel: "From SoundCloud",
            },
            {
              number: "Professional",
              label: "Profile Design",
              sublabel: "Customizable",
            },
            {
              number: "Real-time",
              label: "Analytics",
              sublabel: "Track Performance",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
            >
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-900 font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-500">{stat.sublabel}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-12 border border-orange-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Elevate Your Music Career?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the platform designed for professional artists who are
              serious about their craft.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <SignIn
                socialProvider="google"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-10 py-4 rounded-xl shadow-lg transition-all duration-300 text-lg"
              />
            </motion.div>

            <div className="flex items-center justify-center space-x-2 mt-6 text-gray-500 text-sm">
              <Radio className="w-4 h-4" />
              <span>Seamlessly integrated with SoundCloud</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
