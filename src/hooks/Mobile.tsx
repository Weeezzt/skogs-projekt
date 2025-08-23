import { useEffect, useState } from "react";
export function Mobile() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      (navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches);
    setTouch(!!isTouch);
  }, []);
  return touch;
}
