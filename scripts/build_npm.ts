import { build, emptyDir } from "jsr:@deno/dnt";

const version = Deno.args[0];
if (!version) {
  console.error("Usage: deno run -A scripts/build_npm.ts <version>");
  Deno.exit(1);
}

const TEMP = "./_build_tmp";
const OUT = "./npm";

await emptyDir(TEMP);
await emptyDir(OUT);

const SOURCE_FILES = [
  "mod.ts",
  "client.ts",
  "transport.ts",
  "transport_core.ts",
  "ssh_transport.ts",
];
const SOURCE_DIRS = ["api", "types", "internal"];

for (const file of SOURCE_FILES) {
  await Deno.copyFile(file, `${TEMP}/${file}`);
}
for (const dir of SOURCE_DIRS) {
  await copyDir(dir, `${TEMP}/${dir}`);
}

await Deno.copyFile("_node/transport.ts", `${TEMP}/transport.ts`);
await Deno.copyFile("_node/ssh_transport.ts", `${TEMP}/ssh_transport.ts`);

const tempTransport = await Deno.readTextFile(`${TEMP}/transport.ts`);
await Deno.writeTextFile(
  `${TEMP}/transport.ts`,
  tempTransport.replaceAll(
    `from "../transport_core.ts"`,
    `from "./transport_core.ts"`,
  ),
);

const tempSshTransport = await Deno.readTextFile(`${TEMP}/ssh_transport.ts`);
await Deno.writeTextFile(
  `${TEMP}/ssh_transport.ts`,
  tempSshTransport.replaceAll(
    `from "../transport_core.ts"`,
    `from "./transport_core.ts"`,
  ),
);


await build({
  entryPoints: [`${TEMP}/mod.ts`],
  outDir: OUT,
  shims: {
    deno: false,
  },
  compilerOptions: {
    lib: ["ES2022", "DOM", "DOM.Iterable"],
    target: "ES2022",
  },
  typeCheck: "both",
  test: false,
  package: {
    name: "@ostanin/podman",
    version,
    description:
      "Typed Podman client for Node.js. Full libpod API — containers, images, pods, networks, volumes, secrets, exec, manifests, kube, artifacts, quadlets.",
    license: "MIT",
    engines: {
      node: ">=18.0.0",
    },
    repository: {
      type: "git",
      url: "git+https://github.com/podman-deno/podman.git",
    },
    keywords: [
      "podman",
      "containers",
      "libpod",
      "docker",
      "api",
      "client",
      "typescript",
    ],
    devDependencies: {
      "@types/node": "^22.5.0",
    },
  },
  postBuild() {
    Deno.copyFileSync("README.md", `${OUT}/README.md`);
    const pkgPath = `${OUT}/package.json`;
    const pkg = JSON.parse(Deno.readTextFileSync(pkgPath));
    pkg.types = "./esm/mod.d.ts";
    Deno.writeTextFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  },
});

await Deno.remove(TEMP, { recursive: true });
console.log(`\nBuilt npm package v${version} in ${OUT}/`);

async function copyDir(src: string, dest: string) {
  await Deno.mkdir(dest, { recursive: true });
  for await (const entry of Deno.readDir(src)) {
    const srcPath = `${src}/${entry.name}`;
    const destPath = `${dest}/${entry.name}`;
    if (entry.isDirectory) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile && !entry.name.endsWith("_test.ts")) {
      await Deno.copyFile(srcPath, destPath);
    }
  }
}
