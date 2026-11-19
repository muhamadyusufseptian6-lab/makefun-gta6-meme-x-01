import { copyFileSync, mkdirSync } from "node:fs";
import { statSync } from "node:fs";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The repository root is the directory this script lives in. It is resolved
// from the script's own location, never from the working directory, because
// the grader runs this program from a different cwd.
const repoDir = dirname(fileURLToPath(import.meta.url));

// The bot directory is part of the entry's environment, even though the
// only file this program copies comes from the repository root.
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
void botDir;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

try {
  mkdirSync(outputDir, { recursive: true });
  const postPath = join(repoDir, "POST.json");
  const postContent = readFileSync(postPath, "utf8");
  let postData;
  try {
    postData = JSON.parse(postContent);
  } catch {
    throw new Error(`POST.json is not valid JSON: ${postPath}`);
  }
  if (typeof postData !== "object" || postData === null || typeof postData.url !== "string") {
    throw new Error(`POST.json is missing a string "url" field: ${postPath}`);
  }
  copyFileSync(join(repoDir, "POST.json"), join(outputDir, "POST.json"));
  const copiedPath = join(outputDir, "POST.json");
  const copiedStat = statSync(copiedPath, { throwIfNoEntry: false });
  if (!copiedStat || copiedStat.size === 0) {
    throw new Error(`POST.json was not copied: ${copiedPath} missing or empty after copy`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
