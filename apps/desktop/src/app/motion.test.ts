import { describe, expect, it } from "vitest";
import { getDownloadListMotion } from "./motion";

describe("download list motion", () => {
  it("uses layout animation when motion is allowed", () => {
    const motion = getDownloadListMotion(false);

    expect(motion.layout).toBe(true);
    expect(motion.initial).toEqual({ opacity: 0, y: 14 });
    expect(motion.transition.duration).toBe(0.22);
  });

  it("removes movement and duration when reduced motion is requested", () => {
    const motion = getDownloadListMotion(true);

    expect(motion.layout).toBe(false);
    expect(motion.initial).toBe(false);
    expect(motion.exit).toEqual({ opacity: 0 });
    expect(motion.transition.duration).toBe(0);
  });
});
