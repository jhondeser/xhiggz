import Hero from "@/components/layout/Hero";
import AboutSection from "@/components/sections/About";
import LearningAreas from "@/components/sections/LearningAreas";
import Testimonials from "@/components/sections/Testimonials";
import ContactForm from "@/components/sections/ContactForm";
import { getCourses } from "@/server/courses";

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <>
      <Hero />
      <AboutSection />
      <LearningAreas courses={courses} />
      <Testimonials />
      <ContactForm />
    </>
  );
}
