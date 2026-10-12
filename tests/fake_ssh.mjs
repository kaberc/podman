// Stand-in `ssh` for tests: behaves according to the destination host name.
// Plain JS on node:* APIs so Deno, Node and Bun can all run it.
import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";
import { once } from "node:events";

const args = process.argv.slice(2);
const mode = args[args.length - 1];
const localSocket = args[args.indexOf("-L") + 1].split(":")[0];
const record = (name, text) =>
  fs.writeFileSync(path.join(process.env.FAKE_SSH_RECORD, name), text);

record("pid", String(process.pid));
let flood = Promise.resolve();

function serve() {
  const server = http.createServer(async (req, res) => {
    await flood;
    if (req.url.endsWith("/hang")) return;
    if (req.url.endsWith("/slow")) {
      setTimeout(() => res.end("{}"), 300);
      return;
    }
    if (req.url.endsWith("/die")) {
      fs.writeSync(2, "tunnel broke\n");
      process.exit(255);
    }
    res.setHeader("content-type", "application/json");
    res.end('{"ok":true}');
  });
  server.listen(localSocket);
  return server;
}

switch (mode) {
  case "serve":
    serve();
    break;
  case "flood-stderr": {
    serve();
    const line = "debug1: ".padEnd(1024, "x") + "\n";
    flood = (async () => {
      for (let i = 0; i < 4096; i++) {
        if (!process.stderr.write(line)) await once(process.stderr, "drain");
      }
    })();
    break;
  }
  case "fail":
    fs.writeSync(2, "Permission denied (publickey).\n");
    process.exit(255);
    break;
  case "stuck":
    setInterval(() => {}, 1000);
    break;
  case "ignore-term":
    process.on("SIGTERM", () => record("term", "ignored"));
    setInterval(() => {}, 1000);
    break;
  default:
    fs.writeSync(2, `unknown mode ${mode}\n`);
    process.exit(2);
}
