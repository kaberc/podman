import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import * as https from "node:https";
import type { Duplex } from "node:stream";
import { createTcpTransport } from "../_node/transport.ts";

const cert = `-----BEGIN CERTIFICATE-----
MIIBtTCCAVqgAwIBAgIULesiblEQUOwTqRx25o03EcJ1kBQwCgYIKoZIzj0EAwIw
FDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTI2MTAxMjE1MDQxOFoXDTM2MTAwOTE1
MDQxOFowFDESMBAGA1UEAwwJbG9jYWxob3N0MFkwEwYHKoZIzj0CAQYIKoZIzj0D
AQcDQgAETq7wLJnlvgNEig+0QY5Nei6j6A3qnu7aeBVoCHcH3D6syZ4wmTyeRvAh
GDNztWWep7xUJOb3Vj3Zg+VYc4FkDqOBiTCBhjAdBgNVHQ4EFgQUositCMHQbghL
7H28bMxdWahFRr4wHwYDVR0jBBgwFoAUositCMHQbghL7H28bMxdWahFRr4wDwYD
VR0TAQH/BAUwAwEB/zAUBgNVHREEDTALgglsb2NhbGhvc3QwHQYDVR0lBBYwFAYI
KwYBBQUHAwEGCCsGAQUFBwMCMAoGCCqGSM49BAMCA0kAMEYCIQDO1nsdE9CAdI2z
4yww0z+2VxIIQmyyq7B/0l1kyKbd5QIhAMoYyqwQpdYznwuI+vrunYabpWrNUb3l
xrjgtAXu4uN+
-----END CERTIFICATE-----`;
const key = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgkPInBLrhEuApUodz
n0G2X6tGSZuqQNjZLBWfAj1aCtqhRANCAAROrvAsmeW+A0SKD7RBjk16LqPoDeqe
7tp4FWgIdwfcPqzJnjCZPJ5G8CEYM3O1ZZ6nvFQk5vdWPdmD5VhzgWQO
-----END PRIVATE KEY-----`;

describe("Bun native TLS transport", { skip: !("Bun" in globalThis) }, () => {
  const sockets = new Set<Duplex>();
  const server = https.createServer({
    cert,
    key,
    ca: cert,
    requestCert: true,
    rejectUnauthorized: true,
  }, (req, res) => {
    if (req.url?.endsWith("/timeout")) res.write("early");
    else req.pipe(res);
  });
  let uri = "";
  before(async () => {
    server.on("connection", (socket) => {
      sockets.add(socket);
      socket.on("close", () => sockets.delete(socket));
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve)
    );
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    uri = `https://localhost:${address.port}`;
  });
  after(async () => {
    for (const socket of sockets) socket.destroy();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("uses native fetch with PEM CA arrays and mutual TLS", async () => {
    // Given a daemon requiring a trusted client certificate.
    const transport = createTcpTransport({
      uri,
      tls: { caCerts: [cert, cert], cert, key },
    });
    try {
      // When the public API uploads data, then mTLS and native response metadata work.
      const response = await transport.requestRaw(
        "POST",
        "/build?quiet=true",
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode("archive"));
            controller.close();
          },
        }),
      );
      assert.equal(response.url, `${uri}/v6.0.0/libpod/build?quiet=true`);
      assert.equal(await response.text(), "archive");
    } finally {
      transport.close();
    }
  });

  it("cancels a streaming TLS upload when response consumption times out", async () => {
    // Given an mTLS daemon responding while an upload remains open.
    let cancel: () => void = () => {};
    const cancelled = new Promise<void>((resolve) => {
      cancel = resolve;
    });
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(new Uint8Array(64 * 1024));
      },
      cancel,
    });
    const transport = createTcpTransport({
      uri,
      tls: { caCerts: [cert], cert, key },
      timeout: 100,
    });
    try {
      // When the ordinary response exceeds its timeout.
      const response = await transport.requestRaw("POST", "/timeout", body);
      // Then both response consumption and the upload source stop.
      await assert.rejects(response.text(), { name: "TimeoutError" });
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          cancelled,
          new Promise<void>((_resolve, reject) => {
            timer = setTimeout(
              () => reject(new Error("TLS upload not cancelled")),
              1000,
            );
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
    } finally {
      transport.close();
    }
  });

  for (
    const scenario of [
      "untrusted server",
      "missing client",
      "wrong hostname",
    ] as const
  ) {
    it(`rejects ${scenario} without disabling certificate verification`, async () => {
      // Given incomplete trust, missing client identity or a mismatched hostname.
      const transport = createTcpTransport({
        uri: scenario === "wrong hostname"
          ? uri.replace("localhost", "127.0.0.1")
          : uri,
        tls: {
          caCerts: scenario === "untrusted server" ? undefined : [cert],
          cert: scenario === "missing client" ? undefined : cert,
          key: scenario === "missing client" ? undefined : key,
        },
      });
      try {
        // When connecting, then the TLS handshake fails.
        await assert.rejects(transport.request("GET", "/info"));
      } finally {
        transport.close();
      }
    });
  }
});
