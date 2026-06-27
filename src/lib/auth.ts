// src/lib/auth.ts
//
// Configuración central de NextAuth.
// Proveedores: Google OAuth + Credentials (email + contraseña).
// Estrategia: JWT (sin tabla Session en la BD).
// El userId del alumno se inyecta en el token para que los Server Components
// puedan hacer queries sin tener que buscar por email.

import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Google OAuth ────────────────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Email + contraseña ──────────────────────────────────────────────────
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          image: user.image ?? null,
        };
      },
    }),
  ],

  callbacks: {
    // signIn: cuando alguien entra con Google, hacemos upsert del User en la BD
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        await prisma.user.upsert({
          where: { email: profile.email },
          create: {
            email: profile.email,
            name: profile.name ?? "Usuario",
            image: (profile as { picture?: string }).picture ?? null,
            emailVerified: new Date(),
          },
          update: {
            emailVerified: new Date(),
            // Actualizamos imagen si Google la tiene más reciente
            image: (profile as { picture?: string }).picture ?? undefined,
          },
        });
      }
      return true;
    },

    // jwt: metemos userId en el token para no tener que buscar por email en cada request
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        });
        if (dbUser) token.userId = dbUser.id;
      }
      return token;
    },

    // session: exponemos userId en la sesión del cliente
    async session({ session, token }) {
      if (token.userId && session.user) {
        (session.user as { id?: number }).id = token.userId as number;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  secret: process.env.NEXTAUTH_SECRET,
};
