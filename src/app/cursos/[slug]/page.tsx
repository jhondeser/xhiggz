import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CourseDetailContent from "@/components/pages/CourseDetailContent";
import { getCourseBySlug, getCourseSlugs } from "@/server/courses";

interface Props {
  params: Promise<{ slug: string }>;
}

// Pre-genera estáticamente todas las rutas de cursos en build time.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) return notFound();

  return <CourseDetailContent course={course} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return { title: "Curso no encontrado" };
  }

  return {
    title:       course.title,
    description: course.description,
  };
}
