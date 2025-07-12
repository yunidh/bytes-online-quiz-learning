"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeIn } from "../../variant";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Cards = () => {
  const carouselItems = [
    {
      id: 1,
      image: "/image/screen1.png",
      pretitle: "Courses",
      title: "Learn Programming",
      isMain: true,
    },
    {
      id: 2,
      image: "/image/Avatar.png",
      pretitle: "Avatar",
      title: "Create your persona",
      isMain: false,
    },
    {
      id: 3,
      image: "/image/Achievement.png",
      pretitle: "Achievements",
      title: "Rewards for Learning",
      isMain: false,
    },
    {
      id: 4,
      image: "/image/stats.png",
      pretitle: "Statistics",
      title: "Track your progress",
      isMain: false,
    },
    {
      id: 5,
      image: "/image/custom.png",
      pretitle: "Learning Freedom",
      title: "Create your own quizzes",
      isMain: false,
    },
  ];

  return (
    <section className="flex w-full px-4 sm:px-0 mb-16 sm:mb-20 md:mb-24 lg:mb-32">
      <div className="container">
        {/* Desktop View - Header and Main Card Row */}
        <div className="hidden lg:flex items-center gap-12 mb-16">
          {/* Header Section */}
          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
            className="flex-1"
          >
            <div className="flex-col">
              <h2 className="text-6xl font-bold heading-gradient mb-5">
                Explore Features
              </h2>
              <span className="font-bold text-lg">
                Take a sneak peek into the engaging world that awaits you.
              </span>
            </div>
          </motion.div>

          {/* Desktop View - Main Card */}
          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
            className="flex-1"
          >
            <div className="group relative overflow-hidden border-2 border-white/50 rounded-xl w-full h-[400px] ">
              <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
              <div className="group-hover:scale-105 transition-all duration-500 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-600/20 p-8 rounded-xl">
                <Image
                  layout="fill"
                  src="/image/screen1.png"
                  className="max-w-[100%] max-h-[100%] object-contain"
                  alt="Course preview"
                />
              </div>
              <div className="absolute -bottom-full left-12 group-hover:bottom-24 transition-all duration-500 z-50">
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Courses
                </span>
              </div>
              <div className="absolute -bottom-full left-12 group-hover:bottom-14 transition-all duration-700 z-50">
                <span className="text-3xl text-white">Learn Programming</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Header Section */}
        <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
          className="lg:hidden mb-6 sm:mb-12 gap-y-6 sm:gap-y-10"
        >
          <div className="flex-col place-self-center mb-6 sm:mb-12 mt-2">
            <h2 className="text-3xl sm:text-6xl font-bold heading-gradient mb-3 sm:mb-5">
              Explore Features
            </h2>
            <span className="font-bold text-sm sm:text-lg">
              Take a sneak peek into the engaging world that awaits you.
            </span>
          </div>
        </motion.div>

        {/* Mobile/Tablet Carousel */}
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
          className="flex-1 lg:hidden mt-8"
        >
          <Carousel className="w-full max-w-lg mx-auto">
            <CarouselContent>
              {carouselItems.map((item) => (
                <CarouselItem key={item.id}>
                  <div className="relative overflow-hidden border-2 border-white/50 rounded-xl w-full h-[350px] md:h-[400px]">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
                      {item.isMain ? (
                        <img
                          src={item.image}
                          className="max-w-full max-h-full object-contain"
                          alt={item.title}
                        />
                      ) : (
                        <Image
                          src={item.image}
                          width={320}
                          height={320}
                          className="max-w-full max-h-full object-contain"
                          alt={item.title}
                        />
                      )}
                    </div>
                    {/* Caption below the image */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-center">
                      <span className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 block mb-1">
                        {item.pretitle}
                      </span>
                      <span className="text-sm md:text-base text-white">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/10 border-white/20 hover:bg-white/20" />
            <CarouselNext className="right-2 bg-white/10 border-white/20 hover:bg-white/20" />
          </Carousel>
        </motion.div>

        {/* Desktop View - Four Feature Cards in a Row */}
        <motion.div
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
          className="hidden lg:grid grid-cols-4 gap-6 justify-center"
        >
          {/*Avatar Card*/}
          <div className="group relative overflow-hidden border-2 border-white/50 rounded-xl w-full h-[320px]">
            <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
            <div className="group-hover:scale-105 transition-all duration-500 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-600/20 p-4 rounded-xl">
              <Image
                src="/image/Avatar.png"
                width={240}
                height={240}
                className="max-w-[120%] max-h-[120%] object-contain"
                alt="Avatar"
              />
            </div>
            <div className="absolute -bottom-full left-4 group-hover:bottom-16 transition-all duration-500 z-50">
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Avatar
              </span>
            </div>
            <div className="absolute -bottom-full left-4 group-hover:bottom-8 transition-all duration-700 z-50">
              <span className="text-sm text-white">Create your persona</span>
            </div>
          </div>

          {/*Achievements Card*/}
          <div className="group relative overflow-hidden border-2 border-white/50 rounded-xl w-full h-[320px]">
            <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
            <div className="group-hover:scale-105 transition-all duration-500 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-600/20 p-4 rounded-xl">
              <Image
                src="/image/Achievement.png"
                width={240}
                height={240}
                className="max-w-[120%] max-h-[120%] object-contain"
                alt="Achievement"
              />
            </div>
            <div className="absolute -bottom-full left-4 group-hover:bottom-16 transition-all duration-500 z-50">
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Achievements
              </span>
            </div>
            <div className="absolute -bottom-full left-4 group-hover:bottom-8 transition-all duration-700 z-50">
              <span className="text-sm text-white">Rewards for Learning</span>
            </div>
          </div>

          {/*Statistics Card*/}
          <div className="group relative overflow-hidden border-2 border-white/50 rounded-xl w-full h-[320px]">
            <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
            <div className="group-hover:scale-105 transition-all duration-500 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-600/20 p-4 rounded-xl">
              <Image
                src="/image/stats.png"
                width={240}
                height={240}
                className="max-w-[120%] max-h-[120%] object-contain"
                alt="Statistics"
              />
            </div>
            <div className="absolute -bottom-full left-4 group-hover:bottom-16 transition-all duration-500 z-50">
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Statistics
              </span>
            </div>
            <div className="absolute -bottom-full left-4 group-hover:bottom-8 transition-all duration-700 z-50">
              <span className="text-sm text-white">Track your progress</span>
            </div>
          </div>

          {/*Customization Card*/}
          <div className="group relative overflow-hidden border-2 border-white/50 rounded-xl w-full h-[320px]">
            <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
            <div className="group-hover:scale-105 transition-all duration-500 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-600/20 p-4 rounded-xl">
              <Image
                src="/image/custom.png"
                width={240}
                height={240}
                className="max-w-[120%] max-h-[120%] object-contain"
                alt="Customization"
              />
            </div>
            <div className="absolute -bottom-full left-4 group-hover:bottom-16 transition-all duration-500 z-50">
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Customization
              </span>
            </div>
            <div className="absolute -bottom-full left-4 group-hover:bottom-8 transition-all duration-700 z-50">
              <span className="text-sm text-white">
                Personalize your experience
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Cards;
