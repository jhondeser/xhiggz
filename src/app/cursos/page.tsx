import CoursesPage from "@/components/pages/CoursesPage";
import { getCourses } from "@/server/courses";

export default async function Cursos() {
  const courses = await getCourses();
  return <CoursesPage courses={courses} />;
}
