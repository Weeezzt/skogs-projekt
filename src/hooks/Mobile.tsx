import { useSyncExternalStore } from "react";

const QUERY = "(pointer: coarse)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

// True on touch devices; false during SSR
export function Mobile() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.maxTouchPoints > 0 || window.matchMedia(QUERY).matches,
    () => false
  );
}
