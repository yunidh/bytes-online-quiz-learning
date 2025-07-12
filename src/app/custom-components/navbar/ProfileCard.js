"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getUserStatsFromFirestore,
  resetUserStats,
  initializeUserStats,
} from "@/lib/statsUtils";
import { checkForNewAchievements } from "@/lib/achievementUtils";

const ProfileCard = () => {
  const { user } = UserAuth();
  const [stats, setStats] = useState({
    quizzesTaken: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    quizzesCreated: 0,
  });
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadUserStats(user.uid);
    }
  }, [user]);

  // Refresh stats when the component comes back into focus or when navigating
  useEffect(() => {
    const handleFocus = () => {
      if (user?.uid) {
        loadUserStats(user.uid);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  const loadUserStats = async (userId) => {
    try {
      const userStats = await getUserStatsFromFirestore(userId);
      setStats(userStats);
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  const handleResetStats = async () => {
    if (!user?.uid) return;

    const confirmReset = window.confirm(
      "Are you sure you want to reset all your stats and achievements? This action cannot be undone."
    );

    if (!confirmReset) return;

    setIsResetting(true);

    try {
      await resetUserStats(user.uid);

      // Reset local state
      const resetStats = {
        quizzesTaken: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        quizzesCreated: 0,
      };
      setStats(resetStats);

      // Check for achievements (should be none after reset)
      await checkForNewAchievements(user.uid);

      toast.success("Stats and achievements have been reset!", {
        duration: 3000,
        style: {
          background: "#10b981",
          color: "#ffffff",
        },
      });
    } catch (error) {
      console.error("Error resetting stats:", error);
      toast.error("Failed to reset stats. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
      <Avatar className="self-center h-12 w-12 sm:h-16 sm:w-16">
        <AvatarImage src={user.photoURL} />
        <AvatarFallback>You</AvatarFallback>
      </Avatar>
      <div className="font-light text-sm sm:text-base text-center truncate">
        {user.email}
      </div>
      <Separator />
      <div className="flex flex-col p-5 gap-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Stats</div>
          <Button
            onClick={handleResetStats}
            disabled={isResetting}
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0"
          >
            <RotateCcw
              className={`h-3 w-3 ${isResetting ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Quizzes Taken:
            </span>
            <Badge variant="secondary" className="text-xs">
              {stats.quizzesTaken}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Quizzes Created:
            </span>
            <Badge variant="secondary" className="text-xs">
              {stats.quizzesCreated}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Questions Answered:
            </span>
            <Badge variant="secondary" className="text-xs">
              {stats.questionsAnswered}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Correct Answers:
            </span>
            <Badge variant="outline" className="text-xs text-green-600">
              {stats.correctAnswers}
            </Badge>
          </div>
          {stats.questionsAnswered > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs sm:text-sm">
                Accuracy:
              </span>
              <Badge variant="outline" className="text-xs text-blue-400">
                {Math.round(
                  (stats.correctAnswers / stats.questionsAnswered) * 100
                )}
                %
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
