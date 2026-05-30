import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, "src", "app");
const svg = readFileSync(join(root, "scripts", "site-icon.svg"));

async function png(size) {
  return sharp(svg).resize(size, size).png().toBuffer();
}

const icon32 = await png(32);
const icon48 = await png(48);
const apple180 = await png(180);
const faviconIco = await toIco([icon32, icon48]);

writeFileSync(join(appDir, "icon.png"), icon48);
writeFileSync(join(appDir, "apple-icon.png"), apple180);
writeFileSync(join(appDir, "favicon.ico"), faviconIco);

console.log("Generated src/app/icon.png, apple-icon.png, and favicon.ico");
