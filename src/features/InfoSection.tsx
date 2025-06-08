"use client";

import React, { useState } from "react";
import ImageModal from "./modals/ImageModal";

interface InfoSectionProps {
  title: string;
  id: string;
  children: React.ReactNode;
  ctaLink?: {
    label: string;
    href?: string;
    imageSrc?: string;
    imageAlt?: string;
  };
  size?: "small" | "medium" | "large";
}

export default function InfoSection({
  title,
  id,
  children,
  ctaLink,
  size = "medium",
}: InfoSectionProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <section
      className="bg-beige rounded-xl shadow p-6 mb-6 w-full lg:w-[1000px]"
      id={id}
    >
      <h2 className="text-xl font-bold mb-2 text-forest">{title}</h2>
      <div className="text-gray-800 mb-2">{children}</div>
      {ctaLink && ctaLink.imageSrc && !ctaLink.href && (
        <>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-block mt-2 text-orange font-semibold cursor-pointer hover:underline"
            aria-label={ctaLink.label}
          >
            {ctaLink.label}
          </button>
          <ImageModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            imageSrc={ctaLink.imageSrc}
            imageAlt={ctaLink.imageAlt}
          />
        </>
      )}
      {ctaLink && ctaLink.href && (
        <a
          href={ctaLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-orange font-semibold hover:underline"
        >
          {ctaLink.label}
        </a>
      )}
    </section>
  );
}
