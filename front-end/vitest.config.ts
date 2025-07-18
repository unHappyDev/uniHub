import { config } from "dotenv";
import { defineConfig } from "vitest/config";
import path from "path";

config();

export default defineConfig({
  test: {
    isolate: false,
    fileParallelism: false,
    hookTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@tests": path.resolve(__dirname, "./tests"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@infra": path.resolve(__dirname, "./infra"),
    },
  },
});
