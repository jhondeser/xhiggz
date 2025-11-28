import { notFound } from "next/navigation";
import { courses } from "@/data/cursos";
import CourseDetailContent from "@/components/pages/CourseDetailContent";

interface Params {
  params: { slug: string };
}

export function generateStaticParams(): { slug: string }[] {
  return courses.map((c) => ({ slug: c.slug }));
}

// Agrega async y await los params
export default async function CoursePage({ params }: Params) {
  const { slug } = await params; // ← Aquí está el cambio
  const course = courses.find((c) => c.slug === slug);
  
  if (!course) return notFound();

  return <CourseDetailContent course={course} />;
}