import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  secret: "supersecretsecret",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const apiKey = "AIzaSyA1wO6sb5ovqIUQTawbjSavmCj9cxKUkBc";
        try {
          const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              returnSecureToken: true
            }),
            headers: { 'Content-Type': 'application/json' }
          });

          const data = await res.json();
          
          if (res.ok && data.localId) {
            // Success! Return the user object
            return { 
              id: data.localId, 
              email: data.email, 
              name: data.displayName || "Admin", 
              role: "admin" 
            }
          }
        } catch (error) {
          console.error("Firebase Auth Error:", error);
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role as string
      }
      return session
    }
  }
}
