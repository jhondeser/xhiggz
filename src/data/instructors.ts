// src/data/instructors.ts
export interface Instructor {
  name: string;
  avatar: string;
  role?: string;
}

export const instructors: Instructor[] = [
  {
    name: "Jonathan Alvarez",
    avatar: "/avatars/profe_1.png",
    role: "Instructor",
  },
  {
    name: "Enrique Devars",
    avatar: "/avatars/profe_2.png",
    role: "Instructor",
  },
];
