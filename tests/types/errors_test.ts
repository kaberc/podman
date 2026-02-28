import { assertEquals, assertInstanceOf } from "@std/assert";
import { extractMessage, PodmanError } from "../../types/errors.ts";

Deno.test("PodmanError: properties are set correctly", () => {
  const err = new PodmanError({
    status: 404,
    message: "no such container",
    method: "GET",
    path: "/containers/abc123/json",
  });

  assertEquals(err.status, 404);
  assertEquals(err.message, "no such container");
  assertEquals(err.method, "GET");
  assertEquals(err.path, "/containers/abc123/json");
  assertEquals(err.name, "PodmanError");
});

Deno.test("PodmanError: is an instance of Error", () => {
  const err = new PodmanError({
    status: 500,
    message: "internal error",
    method: "POST",
    path: "/containers/create",
  });

  assertInstanceOf(err, Error);
  assertInstanceOf(err, PodmanError);
});

Deno.test("PodmanError: properties are readonly", () => {
  const err = new PodmanError({
    status: 409,
    message: "conflict",
    method: "DELETE",
    path: "/containers/abc",
  });

  assertEquals(err.status, 409);
  assertEquals(err.status, 409);
  assertEquals(err.method, "DELETE");
  assertEquals(err.path, "/containers/abc");
});

Deno.test("extractMessage: extracts message field", () => {
  assertEquals(extractMessage({ message: "not found" }), "not found");
});

Deno.test("extractMessage: extracts cause field as fallback", () => {
  assertEquals(
    extractMessage({ cause: "container stopped" }),
    "container stopped",
  );
});

Deno.test("extractMessage: message takes priority over cause", () => {
  assertEquals(
    extractMessage({ message: "primary", cause: "secondary" }),
    "primary",
  );
});

Deno.test("extractMessage: returns 'Unknown error' for empty object", () => {
  assertEquals(extractMessage({}), "Unknown error");
});

Deno.test("extractMessage: returns 'Unknown error' for null", () => {
  assertEquals(extractMessage(null), "Unknown error");
});

Deno.test("extractMessage: returns 'Unknown error' for undefined", () => {
  assertEquals(extractMessage(undefined), "Unknown error");
});

Deno.test("extractMessage: returns 'Unknown error' for non-string message", () => {
  assertEquals(extractMessage({ message: 123 }), "Unknown error");
});

Deno.test("extractMessage: returns 'Unknown error' for string input", () => {
  assertEquals(extractMessage("some string"), "Unknown error");
});
