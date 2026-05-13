import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      // Allow access to login page without token
      if (req.nextUrl.pathname.startsWith("/admin/login")) {
        return true;
      }
      return !!token;
    },
  },
})

export const config = {
  matcher: ["/admin/:path*"],
}
