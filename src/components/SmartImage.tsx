"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type SmartImageProps = Omit<ImageProps, "fill" | "width" | "height"> & {
  /** Prevent stretching beyond the file’s real pixel width */
  preventUpscale?: boolean;
  /** Max height clamp (px). Keeps tall portraits from taking over the page. */
  maxHeight?: number; // e.g., 520
  /** Default sizing for responsive layout */
  defaultWidth?: number; // used until image loads (fallback)
  defaultHeight?: number; // used until image loads (fallback)
  /** Rounded corners + shadow wrapper */
  framed?: boolean;
};

export default function SmartImage({
  src,
  alt,
  className,
  preventUpscale = true,
  maxHeight = 520,
  defaultWidth = 1200,
  defaultHeight = 800,
  framed = true,
  sizes = "(max-width: 768px) 100vw, 800px",
  ...rest
}: SmartImageProps) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  const naturalW = natural?.w ?? defaultWidth;
  const naturalH = natural?.h ?? defaultHeight;

  const wrapperStyle: React.CSSProperties =
    preventUpscale && natural?.w ? { maxWidth: natural.w } : {};

  return (
    <div
      className={[
        className,
        "",
        framed ? "rounded-lg overflow-hidden shadow-md" : "",
      ].join(" ")}
      style={wrapperStyle}
    >
      <Image
        src={src}
        alt={alt}
        width={naturalW}
        height={naturalH}
        sizes={sizes}
        // Keep aspect and avoid monstrous portraits
        className="w-full"
        style={{ maxHeight, objectFit: "contain" }}
        placeholder="empty"
        onLoadingComplete={(img) => {
          // `img` has naturalWidth/naturalHeight
          setNatural({ w: img.naturalWidth, h: img.naturalHeight });
        }}
        {...rest}
      />
    </div>
  );
}
