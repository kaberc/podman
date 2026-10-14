import { assertEquals, assertNotEquals } from "@std/assert";
import { collectBuildOutput, ImagesApi } from "../mod.ts";
import { createTransport } from "../_node/transport.ts";

const socketPath = Deno.env.get("PODMAN_SOCK");

Deno.test({
  name: "local builds reuse unchanged layers and invalidate changed COPY input",
  ignore: socketPath === undefined,
  async fn() {
    if (socketPath === undefined) throw new Error("Set PODMAN_SOCK");
    const transport = createTransport({ socketPath });
    const images = new ImagesApi(transport);
    const context = await Deno.makeTempDir({ prefix: "podman-build-cache-" });
    const tag = `localhost/sdk-build-cache-${crypto.randomUUID()}:test`;
    const imageIds = new Set<string>();
    const build = async () => {
      let output = "";
      await collectBuildOutput(
        await images.buildLocal({
          localcontextdir: context,
          t: tag,
          layers: true,
        }),
        async (report) => {
          output += report.stream ?? "";
          for (
            const match of (report.stream ?? "").matchAll(
              /(?:Using cache |--> )([a-f0-9]{12,64})/g,
            )
          ) {
            if (match[1] !== undefined) imageIds.add(match[1]);
          }
        },
      );
      const image = await images.inspect(tag);
      if (image === null) throw new Error("Build did not create its image");
      return { id: image.Id, output };
    };
    try {
      const base = Deno.env.get("PODMAN_BUILD_BASE") ??
        "docker.io/library/alpine:3.21";
      assertEquals(
        await images.exists(base),
        true,
        "Preload PODMAN_BUILD_BASE; this test must not pull",
      );
      await Deno.writeTextFile(
        `${context}/Dockerfile`,
        `FROM ${base}\nRUN echo ${crypto.randomUUID()} > /marker\nCOPY input /input\nRUN cat /input > /result\n`,
      );
      await Deno.writeTextFile(`${context}/input`, "one\n");
      const first = await build();

      const repeated = await build();

      assertEquals(repeated.id, first.id);
      assertEquals((repeated.output.match(/Using cache/g) ?? []).length, 3);

      await Deno.writeTextFile(`${context}/input`, "two\n");
      const changed = await build();

      assertNotEquals(changed.id, first.id);
      assertEquals((changed.output.match(/Using cache/g) ?? []).length, 1);
    } finally {
      await images.remove(tag);
      for (const id of [...imageIds].reverse()) await images.remove(id);
      await Deno.remove(context, { recursive: true });
      transport.close();
    }
  },
});
