import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "react/index": "src/react/index.ts",
    "next/index": "src/next/index.ts",
  },
  format: ["cjs", "esm"],
  dts: { resolve: true },
  sourcemap: true,
  clean: true,
  outDir: "dist",
  minify: true,
  external: ["react", "next"],
});
