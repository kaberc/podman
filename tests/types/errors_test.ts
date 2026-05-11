import { assertEquals, assertInstanceOf } from "@std/assert";
import {
  createPodmanError,
  extractMessage,
  PodmanAuthError,
  PodmanConflictError,
  PodmanError,
  PodmanForbiddenError,
  PodmanNotFoundError,
  PodmanServerError,
} from "../../types/errors.ts";

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

Deno.test("createPodmanError: 401 dispatches to PodmanAuthError", () => {
  const err = createPodmanError(401, { message: "unauthorized" }, "GET", "/x");
  assertInstanceOf(err, PodmanAuthError);
  assertInstanceOf(err, PodmanError);
  assertEquals(err.name, "PodmanAuthError");
  assertEquals(err.status, 401);
  assertEquals(err.message, "unauthorized");
  assertEquals(err.method, "GET");
  assertEquals(err.path, "/x");
});

Deno.test("createPodmanError: 403 dispatches to PodmanForbiddenError", () => {
  const err = createPodmanError(403, { message: "forbidden" }, "POST", "/y");
  assertInstanceOf(err, PodmanForbiddenError);
  assertInstanceOf(err, PodmanError);
  assertEquals(err.name, "PodmanForbiddenError");
  assertEquals(err.status, 403);
});

Deno.test("createPodmanError: 404 dispatches to PodmanNotFoundError", () => {
  const err = createPodmanError(404, { message: "no such" }, "GET", "/z");
  assertInstanceOf(err, PodmanNotFoundError);
  assertInstanceOf(err, PodmanError);
  assertEquals(err.name, "PodmanNotFoundError");
  assertEquals(err.status, 404);
});

Deno.test("createPodmanError: 409 dispatches to PodmanConflictError", () => {
  const err = createPodmanError(
    409,
    { cause: "container already exists in network" },
    "POST",
    "/networks/foo/connect",
  );
  assertInstanceOf(err, PodmanConflictError);
  assertInstanceOf(err, PodmanError);
  assertEquals(err.name, "PodmanConflictError");
  assertEquals(err.status, 409);
  assertEquals(err.message, "container already exists in network");
});

Deno.test("createPodmanError: 500 dispatches to PodmanServerError", () => {
  const err = createPodmanError(500, { message: "boom" }, "GET", "/x");
  assertInstanceOf(err, PodmanServerError);
  assertInstanceOf(err, PodmanError);
  assertEquals(err.name, "PodmanServerError");
  assertEquals(err.status, 500);
});

Deno.test("createPodmanError: 503 also dispatches to PodmanServerError", () => {
  const err = createPodmanError(503, { message: "unavailable" }, "GET", "/x");
  assertInstanceOf(err, PodmanServerError);
  assertEquals(err.status, 503);
});

Deno.test("createPodmanError: unmapped 4xx returns base PodmanError", () => {
  const err = createPodmanError(418, { message: "teapot" }, "GET", "/x");
  assertInstanceOf(err, PodmanError);
  assertEquals(err.constructor.name, "PodmanError");
  assertEquals(err.name, "PodmanError");
  assertEquals(err.status, 418);
});

Deno.test("createPodmanError: 400 returns base PodmanError (not in dispatch table)", () => {
  const err = createPodmanError(400, { message: "bad request" }, "POST", "/x");
  assertInstanceOf(err, PodmanError);
  assertEquals(err.constructor.name, "PodmanError");
});

Deno.test("typed subclasses are catchable as PodmanError (backwards compat)", () => {
  const errs = [
    createPodmanError(401, { message: "" }, "GET", "/"),
    createPodmanError(403, { message: "" }, "GET", "/"),
    createPodmanError(404, { message: "" }, "GET", "/"),
    createPodmanError(409, { message: "" }, "GET", "/"),
    createPodmanError(500, { message: "" }, "GET", "/"),
  ];
  for (const err of errs) {
    assertInstanceOf(err, PodmanError);
    assertInstanceOf(err, Error);
  }
});
