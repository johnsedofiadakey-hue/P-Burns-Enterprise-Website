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
            // Log this activity to Firestore via Admin SDK or REST
            try {
              // Extract IP and user agent if possible
              const ip = req.headers?.['x-forwarded-for'] || 'Unknown IP';
              const userAgent = req.headers?.['user-agent'] || 'Unknown Device';
              
              // We use REST API to avoid server-side firebase initialization issues
              const projectId = "p-burnsenterprise";
              await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/activity_logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  fields: {
                    email: { stringValue: data.email },
                    action: { stringValue: 'login' },
                    ipAddress: { stringValue: typeof ip === 'string' ? ip : ip[0] || 'Unknown' },
                    userAgent: { stringValue: userAgent },
                    timestamp: { timestampValue: new Date().toISOString() }
                  }
                })
              });
            } catch (err) {
              console.error("Failed to log activity", err);
            }

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
