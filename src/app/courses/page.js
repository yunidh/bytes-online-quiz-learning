import { LessonCard } from "../components/lessons/lesson_card_unlocked";

export const metadata = {
  title: "List of Courses",
};

// async function getCourseList() {
//   try {
//     const res = await fetch(`http://localhost:8081/courses/listCourses`, {
//       cache: "no-store",
//     });
//     const Data = res.json();
//     if (!Data.error) {
//       return Data;
//     } else {
//       throw new Error(Data.error);
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   return 0;
// }

export default async function courses() {
  return (
    <main className="mx-48 my-24">
      <div key={3} className="grid grid-cols-2 gap-8 gap-x-40">
        <LessonCard
          courseTitle={"Insert Title"}
          courseId={"Insert Name"}
          alignment="justify-self-start"
        />
        <div className="place-self-center"></div>
      </div>
    </main>
  );
}
