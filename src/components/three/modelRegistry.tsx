"use client";

import dynamic from "next/dynamic";

const MineCurse1 = dynamic(() => import("@/components/three/MineCurse1Model"), {
  ssr: false,
});
const MineCurse2 = dynamic(() => import("@/components/three/MineCurse2Model"), {
  ssr: false,
});
const RobloxCurse1 = dynamic(() => import("@/components/three/RobloxCurse1"), {
  ssr: false,
});
const RobloxCurse2 = dynamic(() => import("@/components/three/RobloxCurse2"), {
  ssr: false,
});
const RobloxCurse3 = dynamic(() => import("@/components/three/RobloxCurse3"), {
  ssr: false,
});
const GodotCurse1 = dynamic(() => import("@/components/three/GodotCurse1Model"), {
  ssr: false,
});
const GodotCurse2 = dynamic(() => import("@/components/three/GodotCurse2Model"), {
  ssr: false,
});

export const modelRegistry = {
  "mine-1": MineCurse1,
  "mine-2": MineCurse2,
  "roblox-1": RobloxCurse1,
  "roblox-2": RobloxCurse2,
  "roblox-3": RobloxCurse3,
  "godot-1": GodotCurse1,
  "godot-2": GodotCurse2,
} as const;