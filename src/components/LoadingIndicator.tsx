// components/LoadingIndicator.tsx
type Props = {
  open?: boolean; // show/hide
  message?: string; // text under the spinner
  size?: number; // spinner size in px (default 40)
};

// Inline loader: sits in the content flow and fades in after 200ms so fast
// loads never flash it.
export default function LoadingIndicator({
  open = true,
  message = "Laddar…",
  size = 40,
}: Props) {
  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-20 animate-fade-in-delayed"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="animate-spin motion-reduce:animate-[spin_2.5s_linear_infinite]"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-beige/10"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-orange"
        />
      </svg>
      <p className="text-sm text-beige/70">{message}</p>
    </div>
  );
}
