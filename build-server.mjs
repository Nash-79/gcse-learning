import esbuild from "esbuild";
import { cpSync, mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";

console.log("Step 1: Building frontend with Vite...");
execSync("npx vite build", { stdio: "inherit" });
console.log("Frontend build complete.");

console.log("Step 2: Bundling Express server with esbuild...");
await esbuild.build({
  entryPoints: ["server/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: "dist/index.cjs",
  external: ["fsevents"],
});
console.log("Server bundle written to dist/index.cjs");

console.log("Step 3: Copying frontend assets to dist/public/...");
mkdirSync("dist/public", { recursive: true });

if (existsSync("dist/index.html")) {
  cpSync("dist/index.html", "dist/public/index.html");
}
if (existsSync("dist/assets")) {
  cpSync("dist/assets", "dist/public/assets", { recursive: true });
}
console.log("Frontend assets copied to dist/public/");

console.log("Build complete.");
