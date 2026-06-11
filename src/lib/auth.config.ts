import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(credentials);
        
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user.length) return null;

        const isValid = await bcrypt.compare(password, user[0].password);
        if (!isValid) return null;

        return { 
          id: user[0].id.toString(), 
          email: user[0].email, 
          name: user[0].name, 
          role: user[0].role 
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: { 
    signIn: '/login', 
    newUser: '/register' 
  },
  session: { 
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};