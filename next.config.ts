import type { NextConfig } from "next"
import "./src/env.js"

const config: NextConfig = {
  eslint: {
    dirs: ["src"],
    ignoreDuringBuilds: true,
  },
}

export default config
