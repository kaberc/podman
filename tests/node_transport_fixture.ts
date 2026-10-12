import { after, before } from "node:test";
import * as http from "node:http";
import * as os from "node:os";
import * as path from "node:path";
import * as fs from "node:fs";
import type { Socket } from "node:net";

export function unixServerFixture(): {
  readonly socketPath: string;
  handler: http.RequestListener;
  readonly connections: () => number;
} {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "podman-node-test-"));
  const fixture = {
    socketPath: path.join(directory, "s.sock"),
    handler: ((_req, res) => res.end()) satisfies http.RequestListener,
    connections: () => sockets.size,
  };
  const server = http.createServer((req, res) => fixture.handler(req, res));
  const sockets = new Set<Socket>();
  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
  });
  before(async () => {
    await new Promise<void>((resolve) =>
      server.listen(fixture.socketPath, resolve)
    );
  });
  after(async () => {
    for (const socket of sockets) socket.destroy();
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return fixture;
}
