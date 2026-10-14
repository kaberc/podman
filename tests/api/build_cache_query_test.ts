import { assertEquals } from "@std/assert";
import { ImagesApi } from "../../api/images.ts";
import { mockTransport } from "./_test_helpers.ts";

for (const local of [false, true]) {
  Deno.test(`${local ? "local" : "tar"} build selects a cache-compatible output format`, async () => {
    const paths: string[] = [];
    const api = new ImagesApi(
      mockTransport(() => ({ status: 200, json: null }), {
        requestStream(_method, path) {
          paths.push(path);
          return Promise.resolve(
            new ReadableStream({
              start(c) {
                c.close();
              },
            }),
          );
        },
      }),
    );

    const stream = local
      ? await api.buildLocal({ localcontextdir: "/context", layers: true })
      : await api.build(
        new ReadableStream({
          start(c) {
            c.close();
          },
        }),
        { layers: true },
      );
    await stream.cancel();

    const query = new URL(paths[0] ?? "", "http://podman").searchParams;
    assertEquals(
      query.get("outputformat"),
      "application/vnd.oci.image.manifest.v1+json",
    );
    assertEquals(query.get("layers"), "true");
  });

  Deno.test(`${local ? "local" : "tar"} build preserves an explicit Docker output format`, async () => {
    const paths: string[] = [];
    const api = new ImagesApi(
      mockTransport(() => ({ status: 200, json: null }), {
        requestStream(_method, path) {
          paths.push(path);
          return Promise.resolve(
            new ReadableStream({
              start(c) {
                c.close();
              },
            }),
          );
        },
      }),
    );
    const outputformat = "application/vnd.docker.distribution.manifest.v2+json";

    const stream = local
      ? await api.buildLocal({ localcontextdir: "/context", outputformat })
      : await api.build(
        new ReadableStream({
          start(c) {
            c.close();
          },
        }),
        { outputformat },
      );
    await stream.cancel();

    assertEquals(
      new URL(paths[0] ?? "", "http://podman").searchParams.get("outputformat"),
      outputformat,
    );
  });
}
