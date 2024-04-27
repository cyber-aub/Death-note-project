import { authMiddleware } from "@clerk/nextjs";
 
 
export default authMiddleware({
  publicRoutes: ["/", "/login"],
});

export const config = {
  matcher: ['/game/:path*','/game'],
};