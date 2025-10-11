import type { NextConfig } from "next"
import "./src/env.js"

const config: NextConfig = {
  typedRoutes: true,
  eslint: {
    dirs: ["src"],
    ignoreDuringBuilds: true,
  },
}

export default config
