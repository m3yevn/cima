import { cpSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "apps/web/dist");
mkdirSync(dist, { recursive: true });
cpSync(join(root, "apps/web/index.html"), join(dist, "index.html"));
cpSync(join(root, "apps/web/docs.html"), join(dist, "docs.html"));
cpSync(join(root, "apps/web/styles.css"), join(dist, "styles.css"));
writeFileSync(
  join(dist, "vercel.json"),
  JSON.stringify({ rewrites: [{ source: "/docs", destination: "/docs.html" }] }, null, 2)
);
console.log("Web dist ready at apps/web/dist");
