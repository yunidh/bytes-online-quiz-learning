"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeIn } from "../../variant";
const Cards = () => {
  return (
    <section className="flex w-full px-4 sm:px-0 mb-16 sm:mb-20 md:mb-24 lg:mb-32">
      <div className="container flex flex-col lg:flex-row gap-8 lg:gap-0">
        <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
          className="flex-1 mb-6 sm:mb-12 gap-y-6 sm:gap-y-10"
        >
          <div className="flex-col place-self-center mb-6 sm:mb-12 mt-2">
            <h2 className="text-3xl sm:text-6xl font-bold heading-gradient mb-3 sm:mb-5">
              Explore Features
            </h2>
            <span className="font-bold text-sm sm:text-lg">
              Take a sneak peek into the engaging world that awaits you.
            </span>
          </div>
          {/*image */}
          <div className="flex justify-self-center group relative mt-8 sm:mt-14 overflow-hidden border-2 border-white/50 rounded-xl">
            {/* overlay*/}

            <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
            {/*img */}
            <div className="group-hover:scale-12 font-bold text-3xl w-full max-w-[550px] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-6005 transition-all duration-500">
              <img
                src="/image/screen1.png"
                className="w-full h-auto"
                alt="Course preview"
              />
            </div>
            {/*pretitle */}
            <div className="absolute -bottom-full left-4 sm:left-12 group-hover:bottom-12 sm:group-hover:bottom-24 transition-all duration-500 z-50">
              <span className="text-lg sm:text-3xl text-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Courses
              </span>
            </div>
            {/* title*/}
            <div className="absolute -bottom-full left-4 sm:left-12 group-hover:bottom-4 sm:group-hover:bottom-14 transition-all duration-700 z-50">
              <span className="text-lg sm:text-3xl text-white">
                Learn Programming
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mt-16 sm:mt-36 ml-4 sm:ml-20 max-h-[320px] sm:max-h-none"
        >
          {/*image*/}
          <div className="group relative overflow-hidden border-2 border-white/50 rounded-xl w-full sm:w-[300px] h-[280px] sm:h-[320px]">
            {/* overlay*/}
            <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300">
              {" "}
            </div>
            {/*img */}
            <div className="group-hover:scale-105 transition-all duration-500 w-full h-full">
              <Image
                src="/image/Avatar.png"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            {/*pretitle */}
            <div className="absolute -bottom-full left-4 sm:left-12 group-hover:bottom-12 sm:group-hover:bottom-24 transition-all duration-500 z-50">
              <span className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Avatar
              </span>
            </div>
            {/* title*/}
            <div className="absolute -bottom-full left-4 sm:left-12 group-hover:bottom-4 sm:group-hover:bottom-14 transition-all duration-700 z-50">
              <span className="text-lg sm:text-2xl text-white">
                Create your persona
              </span>
            </div>
          </div>
          {/*image*/}
          <div className="group relative overflow-hidden border-2 border-white/50 rounded-xl w-full sm:w-[300px] h-[280px] sm:h-[320px]">
            {/* overlay*/}
            <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300">
              {" "}
            </div>
            {/*img */}
            <div className="group-hover:scale-105 transition-all duration-500 w-full h-full">
              <Image
                src="/image/Achievement.png"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            {/*pretitle */}
            <div className="absolute -bottom-full left-4 sm:left-12 group-hover:bottom-12 sm:group-hover:bottom-24 transition-all duration-500 z-50">
              <span className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Achievements
              </span>
            </div>
            {/* title*/}
            <div className="absolute -bottom-full left-4 sm:left-12 group-hover:bottom-4 sm:group-hover:bottom-14 transition-all duration-700 z-50">
              <span className="text-lg sm:text-2xl text-white">
                Rewards for Learning
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Cards;
