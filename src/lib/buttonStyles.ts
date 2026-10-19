// Quiet secondary buttons for the dark background
const base =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-beige/35 bg-beige/5 px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange";

export const ghostButton = `${base} text-beige/90 hover:border-orange hover:text-orange`;

// Neutral at rest, red only on hover/focus so destructive actions don't shout
export const dangerGhostButton = `${base} text-beige/80 hover:border-red-400 hover:text-red-300 hover:bg-red-500/10`;

// Add to a `grid` row so every button gets the width of the widest one
export const buttonRow = "grid-flow-col auto-cols-fr gap-2";
