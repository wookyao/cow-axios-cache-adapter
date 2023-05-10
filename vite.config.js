import { defineConfig } from "vite";
import banner from "vite-plugin-banner";
import pkg from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.js",
      name: "CowAxiosCacheAdapter",
      fileName: (ModuleFormat) => {
        if (ModuleFormat == "es") {
          return `index.mjs`;
        } else if (ModuleFormat == "umd") {
          return `index.umd.js`;
        }

        return `index.js`;
      },
      formats: ["es", "cjs", "umd"],
    },
  },
  plugins: [
    banner({
      outDir: "./dist",
      content: `/**\n * name: ${pkg.name}\n * version: v${pkg.version}\n * description: ${pkg.description}\n * author: ${pkg.author}\n * homepage: ${pkg.homepage}\n */`,
    }),
  ],
});
