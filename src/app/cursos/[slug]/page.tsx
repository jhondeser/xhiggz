import { notFound } from "next/navigation";
import { courses } from "@/data/cursos";
import CourseDetailContent from "@/components/pages/CourseDetailContent";
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  
  if (!course) return notFound();

  return <CourseDetailContent course={course} />;
}

// Opcional: Agregar metadata dinámica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  
  if (!course) {
    return {
      title: 'Curso no encontrado',
    };
  }

  return {
    title: course.title,
    description: course.description,
  };
}