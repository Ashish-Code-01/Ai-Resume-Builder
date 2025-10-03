import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      subscriptionTier: 'free' | 'pro';
      subscriptionStatus: 'active' | 'inactive' | 'cancelled';
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    subscriptionTier: 'free' | 'pro';
    subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  }
}
