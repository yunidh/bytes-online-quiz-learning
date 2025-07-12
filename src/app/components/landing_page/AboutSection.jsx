"use client";
import { useState } from "react";
import React from "react";
import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="text-[#ADB7bE] m-4 sm:m-8 lg:m-20">
      <div className="bg-[#121212] rounded-[50px] sm:rounded-[75px] lg:rounded-[100px] text-center p-4 sm:p-6 lg:p-8 border-[#7B2C8B] border-2 sm:border-4">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-10 px-4 sm:px-8 lg:px-32">
          <div className="order-2 lg:order-1 w-full lg:w-auto">
            <Image
              src="/image/about-image.png"
              width={500}
              height={500}
              alt="About us"
              className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[500px] xl:h-[500px] mx-auto"
            />
          </div>
          <div className="order-1 lg:order-2 w-full lg:w-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold heading-gradient mb-4 sm:mb-6">
              About Us
            </h2>
            <p className="text-sm sm:text-base lg:text-lg font-sans text-center flex-shrink max-w-lg mx-auto">
              Our online learning platform is not just about courses, it's an
              immersive experience designed to make learning fun and rewarding.
              Dive into our interactive Python courses, where learning is not
              just informative but also fun. Earn achievements after completing
              tasks and turn the pursuit of knowledge into thrilling adventure.
              Welcome to a world where knowledge is power and enjoyment is key!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
