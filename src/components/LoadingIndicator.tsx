// components/LoadingIndicator.tsx
import React from "react";

type Props = {
  open?: boolean; // show/hide
  variant?: "bars" | "ring"; // animation style
  message?: string; // optional text under the loader
  size?: number; // base size in px (default 72)
  tintOpacity?: number; // 0..1 backdrop tint (default 0.2)
};

export default function LoadingIndicator({
  open = true,
  variant = "bars",
  size = 72,
}: Props) {
  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[9999] grid place-items-center"
    >
      <div className="flex flex-col items-center gap-4">
        {variant === "bars" ? (
          <div
            className="flex items-end gap-2"
            style={{ height: size, width: size * 1.6 }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block rounded-lg"
                style={{
                  width: size * 0.28,
                  height: size * 0.5,
                  background:
                    "linear-gradient(180deg, var(--color-forest), var(--color-orange))",
                  animation: `barPulse 900ms ${i * 120}ms infinite ease-in-out`,
                  boxShadow:
                    "0 8px 24px color-mix(in oklab, var(--color-orange) 26%, transparent)",
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="relative"
            style={{ width: size, height: size }}
            aria-label="Loading"
          >
            {/* track */}
            <span
              className="absolute inset-0 rounded-full opacity-25"
              style={{
                border: `${Math.max(
                  4,
                  Math.round(size * 0.08)
                )}px solid var(--color-forest)`,
              }}
            />
            {/* spinner arc */}
            <span
              className="absolute inset-0 rounded-full"
              style={{
                borderTop: `${Math.max(
                  4,
                  Math.round(size * 0.08)
                )}px solid var(--color-orange)`,
                borderRight: `${Math.max(
                  4,
                  Math.round(size * 0.08)
                )}px solid transparent`,
                borderBottom: `${Math.max(
                  4,
                  Math.round(size * 0.08)
                )}px solid transparent`,
                borderLeft: `${Math.max(
                  4,
                  Math.round(size * 0.08)
                )}px solid transparent`,
                animation: "ringSpin 900ms linear infinite",
                filter:
                  "drop-shadow(0 8px 18px color-mix(in oklab, var(--color-orange) 30%, transparent))",
              }}
            />
            {/* soft glow center */}
            <span
              className="absolute rounded-full"
              style={{
                inset: size * 0.25,
                background:
                  "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-orange) 20%, transparent), transparent 70%)",
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          span {
            animation: none !important;
          }
        }
        @keyframes barPulse {
          0%,
          100% {
            transform: scaleY(0.6);
            opacity: 0.8;
          }
          50% {
            transform: scaleY(1.15);
            opacity: 1;
            box-shadow: 0 10px 26px
              color-mix(in oklab, var(--color-forest) 28%, transparent);
          }
        }
        @keyframes ringSpin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
