import NextAuth from 'next-auth';
import { authOptions } from '../auth.config';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      address?: string | null;
      city?: string | null;
      zipCode?: string | null;
    }
  }

  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    address?: string | null;
    city?: string | null;
    zipCode?: string | null;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };