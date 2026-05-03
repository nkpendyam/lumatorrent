import { useEffect, useState } from "react";
import type { ReducedMotionPreference } from "../app/settings";

export function useReducedMotion(preference: ReducedMotionPreference = "system") {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (preference !== "system") {
      setReduced(preference === "reduce");
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listener = () => setReduced(query.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, [preference]);

  return reduced;
}
