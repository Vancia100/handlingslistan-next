import type { NextConfig } from "next"
import "./src/env.js"

const config: NextConfig = {
  experimental: {
    dynamicIO: true,
  },
  eslint: {
    dirs: ["src"],
  },
}

export default config
