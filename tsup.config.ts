import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/bot.ts"],
  format: ["esm"],
  target: "node24",
  platform: "node",
  clean: true,
  sourcemap: true,
  splitting: false,
});
