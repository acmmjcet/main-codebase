import { Hono } from "hono";
import { cors } from "hono/cors";
import {rateLimiter}  from "hono-rate-limiter";
import blogRoutes from "./routes/blog";

// Initialize app
const app = new Hono();

// Enable CORS with specific origins
app.use(
  '*',
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://acm-web.acmmjcetofficial.workers.dev"
      ]
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return "*";

      return allowedOrigins.includes(origin) ? origin : "";
    },
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PATCH','OPTIONS','PUT','DELETE'],
    maxAge: 600,
    credentials: true,
  })
);

// Rate limiting: example to limit requests to 100 requests per minute
app.all('*', async (c, next) => {
  await rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    limit: 100, // Limit each IP to 100 requests per 15 minutes
    standardHeaders: "draft-6", // `RateLimit-*` headers for draft-6
    keyGenerator: () => "global-key", // Fallback key for all requests (use a fixed key)
  })(c, next); // Apply rate limiter middleware in the handler context
});

// Security Headers Middleware
app.use('*', (c, next) => {
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none';");
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'no-referrer-when-downgrade');

  return next(); // returning a next() promise
});

// Mount routes
app.route('/blog',blogRoutes);

export default app;