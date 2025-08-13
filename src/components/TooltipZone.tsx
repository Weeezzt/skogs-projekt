"use client";
import React, { useEffect, useId, useRef, useState } from "react";

interface TooltipZoneProps {
  children: React.ReactNode; // trigger element
  tooltip: string; // main text
  position?: "top" | "bottom" | "left" | "right";
  delay?: number; // ms before open (hover)
  closeDelay?: number; // ms before close
  variant?: "dark" | "light"; // visual theme
  matchWidth?: boolean; // match trigger width
  className?: string; // extra classes for the bubble
}

export default function TooltipZone({
  children,
  tooltip,
  position = "top",
  delay = 80,
  closeDelay = 60,
  variant = "dark",
  matchWidth = false,
  className = "",
}: TooltipZoneProps) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLSpanElement | null>(null);

  const [open, setOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined
  );
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  // measure trigger width if needed
  useEffect(() => {
    if (!matchWidth) return;
    const el = triggerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setTriggerWidth(el.getBoundingClientRect().width);
    });
    ro.observe(el);
    setTriggerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [matchWidth]);

  // timers cleanup
  useEffect(() => {
    return () => {
      if (openTimer.current) window.clearTimeout(openTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const scheduleOpen = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setOpen(true), delay);
  };

  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay);
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === "Escape") setOpen(false);
  };

  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2 after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-transparent after:border-b-0",
    bottom:
      "top-full left-1/2 -translate-x-1/2 mt-2 after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-transparent after:border-t-0",
    left: "right-full top-1/2 -translate-y-1/2 mr-2 after:left-full after:top-1/2 after:-translate-y-1/2 after:border-l-transparent after:border-r-0",
    right:
      "left-full top-1/2 -translate-y-1/2 ml-2 after:right-full after:top-1/2 after:-translate-y-1/2 after:border-r-transparent after:border-l-0",
  } as const;

  const theme =
    variant === "light"
      ? "bg-white text-[#1c1c1c] border border-black/10 shadow-lg"
      : "bg-[#1c1c1c] text-[#f9f4ef] shadow-xl";

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex group"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={onKeyDown}
      aria-describedby={open ? id : undefined}
    >
      {children}

      {tooltip?.length > 0 && (
        <span
          ref={tipRef}
          id={id}
          role="tooltip"
          // base positioning
          className={[
            "pointer-events-none absolute z-50",
            posClasses[position],
            // bubble visuals
            "px-3 py-2 rounded-xl text-xs leading-snug",
            theme,
            "backdrop-blur-[2px]",
            // arrow
            "after:content-[''] after:absolute after:w-0 after:h-0 after:border-8 after:border-transparent",
            variant === "light"
              ? "after:border-white"
              : "after:border-[#1c1c1c]",
            // animation: fade + slight scale
            "transition-opacity duration-150",
            // we use group-[.selector] to also animate scale using a child wrapper
            open ? "opacity-100" : "opacity-0",
            className,
          ].join(" ")}
          style={{
            minWidth: 120,
            maxWidth: "20rem",
            width: matchWidth && triggerWidth ? `${triggerWidth}px` : undefined,
          }}
        >
          <span
            className={[
              "block transform-gpu",
              "transition-transform duration-150",
              open ? "scale-100" : "scale-95",
            ].join(" ")}
          >
            {tooltip}
          </span>
        </span>
      )}
    </span>
  );
}
