"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { UserAuth } from "@/app/context/AuthContext";
import userAchievements from "@/lib/userAchivementsStore";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "/lib/firebase";
import { toast, Toaster } from "react-hot-toast";
import {
  availableAchievements,
  getUserStats,
  getUserAchievements,
  checkForNewAchievements,
} from "@/lib/achievementUtils";
import { initializeUserStats } from "@/lib/statsUtils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AchievementScroll() {
  const { user } = UserAuth();
  const updateAchievement = userAchievements(
    (state) => state.updateAchievement
  );
  const [userStats, setUserStats] = useState({
    quizzesTaken: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    quizzesCreated: 0,
  });
  const [expandedAchievement, setExpandedAchievement] = useState(null);
  useEffect(() => {
    if (user?.uid) {
      (async () => {
        console.log("Loading achievements for user:", user.uid);

        // Initialize user stats if they don't exist
        await initializeUserStats(user.uid);

        // Get user stats
        const stats = await getUserStats(user.uid);
        console.log("User stats:", stats);
        setUserStats(stats);

        // Get user achievements and update store
        const achievements = await getUserAchievements(user.uid);
        console.log("User achievements:", achievements);
        updateAchievement(achievements);

        // Check for new achievements based on stats
        await checkForNewAchievements(user.uid);
      })();
    }
  }, [user, updateAchievement]);

  // Refresh achievements when user stats might have changed
  useEffect(() => {
    const handleFocus = () => {
      if (user?.uid) {
        (async () => {
          await initializeUserStats(user.uid);
          const stats = await getUserStats(user.uid);
          setUserStats(stats);

          const achievements = await getUserAchievements(user.uid);
          updateAchievement(achievements);

          await checkForNewAchievements(user.uid);
        })();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, updateAchievement]);

  const achievements = userAchievements((state) => state.achievements);

  // Debug log
  console.log("Current achievements in component:", achievements);

  // Display achievements (use the actual achievements array)
  const displayAchievements = achievements;

  // Demo achievement toggle function
  const toggleDemoAchievement = () => {
    const demoAchievement = {
      id: "demo",
      title: "Demo Achievement",
      description: "This is a demo to test the accordion",
      icon: "🎯",
      unlockedAt: {
        seconds: Math.floor(new Date("2024-01-01").getTime() / 1000),
      }, // Use fixed date for demo
    };

    const hasDemoAchievement = achievements.some((ach) => ach.id === "demo");

    if (hasDemoAchievement) {
      // Remove demo achievement
      const filteredAchievements = achievements.filter(
        (ach) => ach.id !== "demo"
      );
      updateAchievement(filteredAchievements);
    } else {
      // Add demo achievement
      updateAchievement([...achievements, demoAchievement]);
    }
  };

  // Function to get detailed achievement information
  const getAchievementDetails = (achievement) => {
    const baseInfo = availableAchievements.find((a) => a.id === achievement.id);

    switch (achievement.id) {
      case "demo":
        return {
          id: "demo",
          title: "Demo Achievement",
          description: "This is a demo to test the accordion",
          icon: "🎯",
          requirement: `This is just a demo`,
        };
      case "first_quiz":
        return {
          ...baseInfo,
          requirement: `Complete 1 quiz`,
        };
      case "answer_master":
        return {
          ...baseInfo,
          requirement: `Answer 10 questions correctly`,
        };
      case "quiz_creator":
        return {
          ...baseInfo,
          requirement: `Create 1 custom quiz`,
        };
      case "knowledge_seeker":
        return {
          ...baseInfo,
          requirement: `Answer 100 questions`,
        };
      default:
        return baseInfo || achievement;
    }
  };

  const toggleAchievement = (achievementId) => {
    setExpandedAchievement(
      expandedAchievement === achievementId ? null : achievementId
    );
  };

  return (
    <ScrollArea className="h-60 sm:h-72 rounded-md border-2 sm:border-4">
      <div className="p-2 sm:p-4">
        <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold leading-none text-center">
          Achievements
        </h2>

        {/* Demo button - remove this in production */}
        <div className="mb-3 sm:mb-4 text-center space-x-2">
          <Button
            onClick={toggleDemoAchievement}
            size="sm"
            variant="outline"
            className="text-xs sm:text-sm"
          >
            {achievements.some((ach) => ach.id === "demo")
              ? "Remove Demo Achievement"
              : "Add Demo Achievement"}
          </Button>
        </div>

        {displayAchievements.length === 0 ? (
          <div className="text-center text-muted-foreground py-6 sm:py-8">
            <p className="text-xs sm:text-sm">
              Complete quizzes to unlock achievements!
            </p>
            <div className="mt-3 sm:mt-4 space-y-2">
              {availableAchievements.map((achievement) => (
                <div key={achievement.id} className="text-xs opacity-60">
                  {achievement.icon} {achievement.title}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {displayAchievements.map((achievement, index) => {
              const details = getAchievementDetails(achievement);
              const isExpanded = expandedAchievement === achievement.id;

              return (
                <Card
                  key={achievement.id || index}
                  className={`overflow-hidden border-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                    isExpanded
                      ? "ring-2 ring-purple-200 dark:ring-purple-800"
                      : ""
                  }`}
                >
                  {/* Accordion Header */}
                  <Button
                    variant="ghost"
                    className="w-full p-0 h-auto justify-start hover:bg-transparent group"
                    onClick={() => toggleAchievement(achievement.id)}
                  >
                    <CardHeader className="p-2 sm:p-3 w-full flex flex-row items-center justify-between group-hover:bg-white/50 dark:group-hover:bg-black/20 transition-colors duration-200 rounded-t-lg">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-lg sm:text-xl">
                          {achievement.icon}
                        </span>
                        <div className="text-left">
                          <span className="font-semibold text-xs sm:text-sm">
                            {achievement.title}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs text-muted-foreground opacity-60 hidden sm:block">
                          {isExpanded ? "Hide details" : "View details"}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground transition-transform duration-200" />
                        )}
                      </div>
                    </CardHeader>
                  </Button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <CardContent className="bg-secondary/50 p-3 sm:p-4 border-t animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h4 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            Requirement
                          </h4>
                          <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                            {details.requirement}
                          </p>
                        </div>

                        {achievement.unlockedAt && (
                          <div className="bg-green-50 dark:bg-gray-600 p-2 sm:p-3 rounded-lg border text-xs sm:text-sm border-green-200 dark:border-green-800">
                            <h5 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 text-green-700 dark:text-green-300 flex items-center gap-2">
                              Unlocked
                            </h5>
                            <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                              {new Date(
                                achievement.unlockedAt.seconds * 1000
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
