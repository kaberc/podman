import { assertEquals } from "@std/assert";
import { buildQuery } from "../../internal/query.ts";

Deno.test("buildQuery: undefined returns empty string", () => {
  assertEquals(buildQuery(undefined), "");
});

Deno.test("buildQuery: empty object returns empty string", () => {
  assertEquals(buildQuery({}), "");
});

Deno.test("buildQuery: single param", () => {
  assertEquals(buildQuery({ all: true }), "?all=true");
});

Deno.test("buildQuery: multiple params", () => {
  const result = buildQuery({ all: true, size: false });
  assertEquals(result, "?all=true&size=false");
});

Deno.test("buildQuery: numeric param", () => {
  assertEquals(buildQuery({ timeout: 30 }), "?timeout=30");
});

Deno.test("buildQuery: string param", () => {
  assertEquals(buildQuery({ signal: "SIGTERM" }), "?signal=SIGTERM");
});

Deno.test("buildQuery: undefined values are skipped", () => {
  assertEquals(buildQuery({ all: true, size: undefined }), "?all=true");
});

Deno.test("buildQuery: all undefined values returns empty string", () => {
  assertEquals(buildQuery({ a: undefined, b: undefined }), "");
});

Deno.test("buildQuery: object value is JSON-stringified", () => {
  const filters = { label: ["app=web"] };
  const result = buildQuery({ filters });
  assertEquals(
    result,
    `?filters=${encodeURIComponent(JSON.stringify(filters))}`,
  );
});

Deno.test("buildQuery: special characters are encoded", () => {
  assertEquals(buildQuery({ name: "my container" }), "?name=my%20container");
});

Deno.test("buildQuery: array value emits repeated keys", () => {
  const result = buildQuery({ changes: ["CMD /bin/sh"] });
  assertEquals(result, "?changes=CMD%20%2Fbin%2Fsh");
});

Deno.test("buildQuery: multi-element array emits repeated keys", () => {
  const result = buildQuery({ names: ["foo", "bar"] });
  assertEquals(result, "?names=foo&names=bar");
});

Deno.test("buildQuery: empty array produces no params for that key", () => {
  const result = buildQuery({ all: true, names: [] });
  assertEquals(result, "?all=true");
});
