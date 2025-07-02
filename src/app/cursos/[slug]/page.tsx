// src/app/cursos/[slug]/page.tsx
import { notFound } from "next/navigation";
import { courses } from "@/data/cursos";
import CourseDetailContent from "@/components/pages/CourseDetailContent";

interface Params {
  params: { slug: string };
}

export function generateStaticParams(): { slug: string }[] {
  return courses.map((c) => ({ slug: c.slug }));
}

export default function CoursePage({ params: { slug } }: Params) {
  const course = courses.find((c) => c.slug === slug);
  if (!course) return notFound();

  // Le pasamos el objeto curso al componente cliente
  return <CourseDetailContent course={course} />;
}
