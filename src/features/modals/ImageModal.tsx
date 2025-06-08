import React from "react";

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt?: string;
}

export default function ImageModal({
  open,
  onClose,
  imageSrc,
  imageAlt,
}: ImageModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-orange text-2xl font-bold cursor-pointer"
          aria-label="Stäng"
        >
          &times;
        </button>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-h-[70vh] w-auto rounded"
        />
        {imageAlt && (
          <div className="mt-2 text-gray-700 text-sm">{imageAlt}</div>
        )}
      </div>
    </div>
  );
}
