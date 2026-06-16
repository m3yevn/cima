import { cpSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "apps/web/dist");
const fieldApp = join(root, "apps/web/public/app");

mkdirSync(dist, { recursive: true });
cpSync(join(root, "apps/web/index.html"), join(dist, "index.html"));
cpSync(join(root, "apps/web/docs.html"), join(dist, "docs.html"));
cpSync(join(root, "apps/web/styles.css"), join(dist, "styles.css"));

if (!existsSync(fieldApp)) {
  console.error("Missing field PWA build at apps/web/public/app — run: npm run build --prefix apps/field");
  process.exit(1);
}
cpSync(fieldApp, join(dist, "app"), { recursive: true });

console.log("Web dist ready at apps/web/dist (landing + docs + /app PWA)");
