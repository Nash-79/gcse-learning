import esbuild from "esbuild";
import { cpSync, mkdirSync, existsSync } from "fs";

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

mkdirSync("dist/public", { recursive: true });

if (existsSync("dist/index.html")) {
  cpSync("dist/index.html", "dist/public/index.html");
}
if (existsSync("dist/assets")) {
  cpSync("dist/assets", "dist/public/assets", { recursive: true });
}

console.log("Frontend assets copied to dist/public/");
