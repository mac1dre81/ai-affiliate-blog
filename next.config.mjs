import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const isProd = process.env.NODE_ENV === "production";

function buildCsp() {
  const prod = isProd;
  const scriptSrc = prod
    ? ["'self'"]
    : ["'self'", "'unsafe-inline'", "'unsafe-eval'"];
  const styleSrc = prod
    ? ["'self'", "'unsafe-inline'"]
    : ["'self'", "'unsafe-inline'"];
  const imgSrc = ["'self'", "data:", "https:"];
  const connectSrc = ["'self'", "https:", "wss:"];
  const fontSrc = ["'self'", "data:", "https:"];
  const frameAncestors = ["'none'"];

  const directives = {
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    "style-src": styleSrc,
    "img-src": imgSrc,
    "connect-src": connectSrc,
    "font-src": fontSrc,
    "frame-ancestors": frameAncestors,
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "object-src": ["'none'"],
    "upgrade-insecure-requests": prod ? [] : undefined,
  };

  return Object.entries(directives)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => (Array.isArray(v) ? `${k} ${v.join(" ")}` : k))
    .join("; ");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["mongoose"],
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      };
    }

    // For mixed ESM/CJS modules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    return config;
  },
  async headers() {
    const csp = buildCsp();
    const securityHeaders = [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      ...(isProd
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]
        : []),
      { key: "Content-Security-Policy", value: csp },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
