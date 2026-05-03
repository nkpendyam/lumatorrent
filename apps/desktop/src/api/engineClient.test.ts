import { describe, expect, it } from "vitest";
import { assertLocalEngineUrl } from "./engineClient";

describe("engine client safety", () => {
  it("allows localhost engine URLs", () => {
    expect(() => assertLocalEngineUrl("http://127.0.0.1:19876")).not.toThrow();
    expect(() => assertLocalEngineUrl("http://localhost:19876")).not.toThrow();
  });

  it("rejects non-localhost engine URLs for MVP", () => {
    expect(() => assertLocalEngineUrl("http://0.0.0.0:19876")).toThrow();
    expect(() => assertLocalEngineUrl("http://192.168.1.10:19876")).toThrow();
  });
});
