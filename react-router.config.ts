import type { Config } from "@react-router/dev/config";

export default {
  ssr: true, // Enable SSR for nodemailer email service
  buildDirectory: "build",
  serverBuildFile: "index.js",
} satisfies Config;
