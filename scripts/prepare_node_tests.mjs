import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = process.argv[2];
if (!output) throw new Error("Usage: bun scripts/prepare_node_tests.mjs <output-directory>");
await mkdir(output, { recursive: true });

const transpiler = new Bun.Transpiler({ loader: "ts", target: "node" });
const packageDirectory = process.argv[3] ?? resolve(root, "npm");
const runtime = pathToFileURL(resolve(packageDirectory, "esm")).href;
const tests = resolve(root, "tests");
for (const name of await readdir(tests)) {
  if (!/^(node|bun)_.*\.ts$/.test(name) && name !== "ssh_transport_test.ts") continue;
  const source = await readFile(resolve(tests, name), "utf8");
  const javascript = transpiler.transformSync(source)
    .replaceAll(/(["'])\.\.\/(?:_node\/)?([^"']+)\.ts\1/g, `$1${runtime}/$2.js$1`)
    .replaceAll(/(["'])\.\/([^"']+)\.ts\1/g, "$1./$2.mjs$1");
  const target = name === "ssh_transport_test.ts" ? `node_${name}` : name;
  await writeFile(resolve(output, target.replace(/\.ts$/, ".mjs")), javascript);
}
await copyFile(resolve(tests, "fake_ssh.mjs"), resolve(output, "fake_ssh.mjs"));
