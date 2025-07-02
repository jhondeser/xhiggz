// src/types/index.ts
import { ReactNode } from "react";

export interface Course {
  id: string;           // nuevo campo
  slug: string;
  title: string;
  description: string;
  emoji?: string;
  model3D: ReactNode;
  categoria: string;
  img: string;
}
