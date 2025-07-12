"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { UserAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const Header = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="banner px-4 sm:px-0">
      <div className="grid grid-cols-1 mt-2 lg:grid-cols-12 gap-8 lg:gap-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 place-self-center text-center lg:text-left order-2 lg:order-1"
        >
          <h1 className="text-white mb-4 sm:mb-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Level up your {""}
            </span>
            <br></br>
            <TypeAnimation
              sequence={[
                "learning adventure",
                1000,
                "coding skills",
                1000,
                "programming journey",
                1000,
              ]}
              wrapper="span"
              speed={30}
              repeat={Infinity}
            />
          </h1>
          <p className="text-[#ADB7BE] text-sm sm:text-base lg:text-lg xl:text-xl mb-4 sm:mb-6 text-justify lg:text-left max-w-lg mx-auto lg:mx-0">
            Our gamified online platform transforms education into an immersive
            adventure. Enhance your learning skills with our innovative gamified
            learning platform where education meets excitement. Join us and
            unlock the doors to a world where education meets excitement.
          </p>

          <div className="flex justify-center lg:justify-start">
            {!user ? (
              <button
                className="px-6 sm:px-10 py-3 sm:py-4 w-full sm:w-auto text-lg sm:text-2xl rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:bg-slate-200 text-white transition-all duration-300 hover:scale-105"
                onClick={handleSignIn}
              >
                Start Now
              </button>
            ) : (
              <Link href="/courses">
                <button className="px-6 sm:px-10 py-3 sm:py-4 w-full sm:w-auto text-lg sm:text-2xl rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:bg-slate-200 text-white transition-all duration-300 hover:scale-105">
                  Continue
                </button>
              </Link>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 place-self-center mt-4 lg:mt-0 order-1 lg:order-2"
        >
          <Image
            src="/image/online.png"
            alt="online"
            width={500}
            height={500}
            className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-full lg:h-full max-w-[500px] mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Header;
