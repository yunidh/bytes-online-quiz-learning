"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { firaCode } from "@/app/layout";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export function LessonCard(props) {
  const [isActive, setActive] = useState(false);
  const [lessonList, setLessonList] = useState([]);

  const showLesson = () => {
    console.log(isActive);
    return isActive ? setActive(false) : setActive(true);
  };

  const LessonButton = ({ isLocked }) => {
    return (
      <Button
        disabled={false}
        onClick={showLesson}
        variant="outline"
        className="text-3xl group font-semibold flex-grow p-10 m-0 hover:scale-105 transition-transform duration-300"
      >
        <div className="group-hover:heading-gradient transition- duration-300">
          {"Insert Course"}
        </div>
      </Button>
    );
  };

  return (
    <Card
      className={
        "border-8 border-border transition-all duration-500 max-h-[390px]"
      }
    >
      {/* <Button onClick={() => updateProgress(1, "unit2", 5)}>test</Button> */}
      <CardHeader className="pt-4 group">
        <CardTitle className="group z-0 text-center font-firacode tracking-wide flex">
          <LessonButton title={"Insert Title"} isLocked={false} />
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
