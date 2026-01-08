import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  //   minify: true,
  bundle: true,
  // This is the key: it bundles both npm packages AND your local workspace packages
  noExternal: [/. */],
  external: ["@prisma/client", "express"],
  splitting: false,
  platform: "node",
  target: "node22",
})
