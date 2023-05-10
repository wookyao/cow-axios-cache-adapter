import { defineConfig } from "vite";

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
});
