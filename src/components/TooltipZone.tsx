import React from "react";

interface TooltipZoneProps {
  children: React.ReactNode; // The element that triggers the tooltip
  tooltip: string; // The tooltip content
  position?: "top" | "bottom" | "left" | "right";
}

export default function TooltipZone({
  children,
  tooltip,
  position = "top",
}: TooltipZoneProps) {
  // Positioning classes
  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span className="relative group">
      {children}
      {tooltip?.length > 0 && (
        <span
          className={`
          pointer-events-none absolute z-50 px-3 py-2 rounded-lg shadow-lg bg-white text-gray-800 text-xs border border-orange
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          ${posClasses[position]}
          min-w-[120px] max-w-xs
        `}
        >
          {tooltip}
        </span>
      )}
    </span>
  );
}
