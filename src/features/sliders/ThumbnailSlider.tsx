"use client";
import React from "react";
import Image from "next/image";
import {
  useKeenSlider,
  KeenSliderPlugin,
  KeenSliderInstance,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function ThumbnailPlugin(
  mainRef: React.RefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("active");
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

interface Section {
  title: string;
  id: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
}

interface ThumbnailSliderProps {
  sections?: Section[];
}

export default function ThumbnailSlider(
  { sections = [] }: ThumbnailSliderProps = { sections: [] }
) {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <div className="w-full  mx-auto">
      <div ref={sliderRef} className="keen-slider w-full  h-[350px]">
        {sections.map((section, index) => (
          <div key={section.id} className="keen-slider__slide w-full ">
            {section.imageSrc ? (
              <>
                <Image
                  src={section.imageSrc}
                  alt={section.imageAlt || section.title}
                  fill
                  className="object-cover rounded-xl"
                  sizes="w-full"
                  priority
                />
                <div className="absolute top-0 left-0 bg-black/50 text-white px-4 py-2 rounded-tl-xl text-lg font-bold">
                  {section.title}
                </div>
                {section.description && (
                  <div className="absolute bottom-0 left-0 bg-white/80 text-black px-4 py-2 rounded-bl-xl text-sm">
                    {section.description}
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center">{section.title}</div>
            )}
          </div>
        ))}
      </div>

      <div ref={thumbnailRef} className="keen-slider thumbnail h-50 mt-4">
        {sections.map((section, index) => (
          <div key={section.id + "-thumb"} className="keen-slider__slide">
            {section.imageSrc ? (
              <>
                <Image
                  src={section.imageSrc}
                  alt={section.imageAlt || section.title}
                  fill
                  className="object-cover rounded-xl cursor-pointer"
                  sizes="(max-width: 800px) 100vw, 800px"
                  priority
                />
                <div className="absolute top-0 left-0 bg-black/50 text-white px-4 py-2 rounded-tl-xl text-lg font-bold">
                  {section.title}
                </div>
              </>
            ) : (
              <div className="p-2 text-sm text-center">{section.title}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
